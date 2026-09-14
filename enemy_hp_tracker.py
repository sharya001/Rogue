#!/usr/bin/env python3
"""
DuckStation PS1 敌人HP内存修改器
用法: python enemy_hp_tracker.py
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

def scan_mem(h, target, regions):
    print(f"\n扫描值: {target}")
    found = []
    for name, start, end in regions:
        print(f"  扫描 {name}: 0x{start:X} - 0x{end:X}")
        addr = start
        while addr < end:
            v = read_mem(h, addr)
            if v == target:
                found.append(addr)
                print(f"    找到: 0x{addr:X} = {v}")
            addr += 4
            if (addr - start) % (1024*1024) == 0:
                print(f"    进度: {(addr-start)//(1024*1024)} MB")
    return found

def main():
    print("="*50)
    print("DuckStation PS1 敌人HP修改器")
    print("="*50)
    
    pid = get_pid()
    if not pid:
        print("错误: 未找到DuckStation进程!")
        print("请确保DuckStation正在运行")
        return
    
    print(f"找到进程 PID={pid}")
    h = open_proc(pid)
    if not h:
        print("错误: 无法打开进程")
        return
    
    print("成功获取句柄\n")
    
    # PS1常见内存区域
    regions = [
        ("主RAM", 0x80000000, 0x80100000),
        ("程序区", 0x00100000, 0x00200000),
    ]
    
    while True:
        print("\n操作菜单:")
        print("1. 扫描HP地址 (首次)")
        print("2. 修改指定地址HP")
        print("3. 追踪HP减少(-10)")
        print("4. 退出")
        
        try:
            choice = input("\n选择(1-4): ").strip()
        except:
            break
        
        if choice == '1':
            try:
                hp = int(input("当前敌人HP值: "))
            except:
                print("输入无效")
                continue
            
            found = scan_mem(h, hp, regions)
            if not found:
                print("未找到匹配地址")
            else:
                print(f"\n找到{len(found)}个地址:")
                for i, addr in enumerate(found):
                    print(f"  {i+1}. 0x{addr:X}")
                
                try:
                    sel = int(input(f"\n选择地址编号(1-{len(found)}, 0取消): ")) - 1
                    if 0 <= sel < len(found):
                        tracked_addr = found[sel]
                        print(f"\n已追踪地址: 0x{tracked_addr:X}")
                        print("输入'reduce'减少10HP, 'quit'退出")
                        while True:
                            action = input("> ").strip().lower()
                            if action == 'quit':
                                break
                            elif action == 'reduce':
                                cur = read_mem(h, tracked_addr)
                                if cur is not None:
                                    new_val = cur - 10
                                    if write_mem(h, tracked_addr, new_val):
                                        print(f"  HP: {cur} -> {new_val} ✓")
                                    else:
                                        print("  写入失败 ✗")
                                else:
                                    print("  读取失败 ✗")
                            else:
                                print("  输入'reduce'或'quit'")
                except:
                    print("无效选择")
        
        elif choice == '2':
            try:
                addr = int(input("地址(十六进制, 如80012340): "), 16)
                val = int(input("新HP值: "))
                if write_mem(h, addr, val):
                    print(f"✓ 成功: 0x{addr:X} = {val}")
                else:
                    print("✗ 写入失败")
            except:
                print("输入无效")
        
        elif choice == '3':
            try:
                addr = int(input("追踪地址(十六进制): "), 16)
                print(f"追踪 0x{addr:X}")
                while True:
                    action = input("输入'reduce'减10, 'quit'退出: ").strip().lower()
                    if action == 'quit':
                        break
                    elif action == 'reduce':
                        cur = read_mem(h, addr)
                        if cur is not None:
                            nw = cur - 10
                            if write_mem(h, addr, nw):
                                print(f"  HP: {cur} -> {nw} ✓")
                            else:
                                print("  写入失败 ✗")
                        else:
                            print("  读取失败 ✗")
            except:
                print("输入无效")
        
        elif choice == '4':
            print("退出")
            break
    
    ctypes.windll.kernel32.CloseHandle(h)

if __name__ == "__main__":
    main()
