#!/usr/bin/env python3
"""
DuckStation PS1 敌人HP修改器 - 命令行交互版
用法: python enemy_hp_cli.py [scan|modify|reduce|freeze] [参数]
"""
import ctypes
import sys
import subprocess

PROCESS_QUERY_INFORMATION = 0x0400
PROCESS_VM_READ = 0x0010
PROCESS_VM_WRITE = 0x0020
PROCESS_VM_OPERATION = 0x0008

def get_pid():
    try:
        r = subprocess.run(['wmic', 'process', 'where', 'name like "%duckstation%"', 'get', 'ProcessId,Name'],
                          capture_output=True, text=True, encoding='gbk', errors='ignore')
        for line in r.stdout.split('\n'):
            line = line.strip()
            if line and 'duckstation' in line.lower() and 'ProcessId' not in line:
                parts = line.split()
                if parts:
                    return int(parts[1])
    except:
        pass
    return None

def open_proc(pid):
    h = ctypes.windll.kernel32.OpenProcess(
        PROCESS_QUERY_INFORMATION | PROCESS_VM_READ | PROCESS_VM_WRITE | PROCESS_VM_OPERATION,
        False, pid)
    return h

def read_mem(h, addr, sz=4):
    buf = ctypes.create_string_buffer(sz)
    br = ctypes.c_size_t(0)
    ok = ctypes.windll.kernel32.ReadProcessMemory(h, ctypes.c_void_p(addr), buf, sz, ctypes.byref(br))
    if ok:
        return int.from_bytes(buf.raw[:sz], byteorder='little', signed=True)
    return None

def write_mem(h, addr, val):
    buf = ctypes.create_string_buffer(4)
    buf.raw = val.to_bytes(4, byteorder='little', signed=True)
    bw = ctypes.c_size_t(0)
    return ctypes.windll.kernel32.WriteProcessMemory(h, ctypes.c_void_p(addr), buf, 4, ctypes.byref(bw))

def main():
    if len(sys.argv) < 2:
        print("用法:")
        print("  python enemy_hp_cli.py scan <HP值>        - 扫描内存找到HP地址")
        print("  python enemy_hp_cli.py reduce <地址>       - 减少10HP")
        print("  python enemy_hp_cli.py freeze <地址> <HP>  - 冻结HP值")
        print("  python enemy_hp_cli.py set <地址> <HP>     - 设置HP值")
        print("  python enemy_hp_cli.py check <地址>        - 检查当前HP值")
        print("  python enemy_hp_cli.py list                - 列出所有已保存的地址")
        return
    
    cmd = sys.argv[1]
    pid = get_pid()
    if not pid:
        print("错误: 未找到DuckStation进程!")
        return
    
    h = open_proc(pid)
    if not h:
        print("错误: 无法打开进程")
        return
    
    if cmd == 'scan':
        if len(sys.argv) < 3:
            print("用法: python enemy_hp_cli.py scan <HP值>")
            return
        target = int(sys.argv[2])
        
        regions = [
            ("主RAM", 0x80000000, 0x80100000),
            ("程序区", 0x00100000, 0x00200000),
        ]
        
        print(f"\n扫描HP值: {target}")
        found = []
        for name, start, end in regions:
            print(f"  扫描 {name}...")
            addr = start
            while addr < end:
                v = read_mem(h, addr)
                if v == target:
                    found.append(addr)
                    print(f"    找到: 0x{addr:X} = {v}")
                addr += 4
                if (addr - start) % (1024*1024) == 0:
                    print(f"    进度: {(addr-start)//(1024*1024)} MB")
        
        if not found:
            print("未找到匹配地址")
        else:
            print(f"\n共找到 {len(found)} 个地址")
            for i, addr in enumerate(found):
                print(f"  [{i+1}] 0x{addr:X}")
    
    elif cmd == 'check':
        if len(sys.argv) < 3:
            print("用法: python enemy_hp_cli.py check <地址>")
            return
        addr = int(sys.argv[2], 16)
        val = read_mem(h, addr)
        if val is not None:
            print(f"地址 0x{addr:X} 当前值: {val}")
        else:
            print("读取失败")
    
    elif cmd == 'set':
        if len(sys.argv) < 4:
            print("用法: python enemy_hp_cli.py set <地址> <HP值>")
            return
        addr = int(sys.argv[2], 16)
        val = int(sys.argv[3])
        if write_mem(h, addr, val):
            print(f"✓ 成功: 0x{addr:X} = {val}")
        else:
            print("✗ 写入失败")
    
    elif cmd == 'reduce':
        if len(sys.argv) < 3:
            print("用法: python enemy_hp_cli.py reduce <地址>")
            return
        addr = int(sys.argv[2], 16)
        cur = read_mem(h, addr)
        if cur is not None:
            new_val = cur - 10
            if write_mem(h, addr, new_val):
                print(f"✓ HP: {cur} -> {new_val}")
            else:
                print("✗ 写入失败")
        else:
            print("✗ 读取失败")
    
    elif cmd == 'freeze':
        if len(sys.argv) < 4:
            print("用法: python enemy_hp_cli.py freeze <地址> <HP值>")
            print("持续冻结: 每秒检查一次并恢复HP值")
            return
        addr = int(sys.argv[2], 16)
        val = int(sys.argv[3])
        print(f"冻结地址 0x{addr:X} 为 {val} (Ctrl+C 停止)")
        try:
            while True:
                cur = read_mem(h, addr)
                if cur != val:
                    write_mem(h, addr, val)
                    print(f"恢复: {cur} -> {val}")
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n冻结已停止")
    
    else:
        print(f"未知命令: {cmd}")
    
    ctypes.windll.kernel32.CloseHandle(h)

if __name__ == "__main__":
    import time
    main()
