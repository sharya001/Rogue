#!/usr/bin/env python3
"""
DuckStation PS1 敌人HP智能扫描器
自动扫描常见HP值范围，找出可能的敌人HP地址
"""
import ctypes
import sys
import subprocess
import time

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

def scan_range(h, min_val, max_val, step=10, regions=None):
    """扫描指定范围内的所有整数值，找出出现频率高的地址"""
    if regions is None:
        regions = [
            ("主RAM", 0x80010000, 0x80090000),
        ]
    
    results = {}
    total_scanned = 0
    
    for name, start, end in regions:
        print(f"\n扫描 {name}: 0x{start:X} - 0x{end:X}")
        addr = start
        while addr < end:
            v = read_mem(h, addr)
            if v is not None and min_val <= v <= max_val and v > 0:
                if addr not in results:
                    results[addr] = []
                results[addr].append(v)
            
            addr += 4
            total_scanned += 1
            
            if total_scanned % 100000 == 0:
                print(f"  已扫描 {total_scanned//1024//1024:.1f} MB, 找到 {len(results)} 个候选地址")
    
    return results

def main():
    print("="*60)
    print("DuckStation PS1 敌人HP智能扫描器")
    print("="*60)
    
    pid = get_pid()
    if not pid:
        print("错误: 未找到DuckStation进程!")
        return
    
    print(f"DuckStation PID: {pid}")
    h = open_proc(pid)
    if not h:
        print("错误: 无法打开进程")
        return
    
    print("成功获取进程句柄\n")
    
    # 询问HP范围
    print("请输入敌人HP的可能范围:")
    print("格式: 最小值 最大值 (例如: 10 500)")
    try:
        inp = input("> ").strip().split()
        if len(inp) != 2:
            print("输入格式错误，使用默认范围 10-500")
            min_val, max_val = 10, 500
        else:
            min_val, max_val = int(inp[0]), int(inp[1])
    except:
        min_val, max_val = 10, 500
    
    print(f"\n扫描范围: {min_val} - {max_val}")
    print("这可能需要几分钟，请耐心等待...\n")
    
    start_time = time.time()
    results = scan_range(h, min_val, max_val)
    elapsed = time.time() - start_time
    
    print(f"\n扫描完成! 耗时 {elapsed:.1f} 秒")
    print(f"找到 {len(results)} 个候选地址\n")
    
    if results:
        print("候选地址列表 (显示最近扫描到的值):")
        for addr, values in sorted(results.items()):
            latest = values[-1] if values else 0
            print(f"  0x{addr:X} = {latest} (扫描到 {len(values)} 次)")
        
        print(f"\n提示:")
        print("1. 如果看到多个相同值的地址，那很可能就是HP地址")
        print("2. 记住地址后，下次HP变化时告诉我，我会帮你更新")
        print("3. 你也可以手动记录这些地址，下次用以下命令:")
        print("   python enemy_hp_cli.py reduce 0x地址  # 减少10HP")
        print("   python enemy_hp_cli.py check 0x地址   # 检查当前值")
    else:
        print("未找到匹配地址，可能HP值不在扫描范围内")
        print("尝试缩小范围或使用更精确的HP值")
    
    ctypes.windll.kernel32.CloseHandle(h)

if __name__ == "__main__":
    main()
