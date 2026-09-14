#!/usr/bin/env python3
"""
DuckStation PS1 敌人HP扫描器 - 自动扫描模式
自动扫描常见HP值范围并输出结果
"""
import ctypes
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

def scan_region(h, name, start, end, min_val, max_val, interval=100000):
    """扫描单个内存区域"""
    results = {}
    addr = start
    scanned = 0
    
    while addr < end:
        v = read_mem(h, addr)
        if v is not None and min_val <= v <= max_val and v > 0:
            results[addr] = v
        
        addr += 4
        scanned += 1
        
        if scanned % interval == 0:
            print(f"  {name}: {scanned//1024//1024:.1f} MB")
    
    return results

def main():
    print("DuckStation PS1 敌人HP自动扫描器")
    
    pid = get_pid()
    if not pid:
        print("错误: 未找到DuckStation进程!")
        return
    
    print(f"PID: {pid}")
    h = open_proc(pid)
    if not h:
        print("错误: 无法打开进程")
        return
    
    # HP扫描范围
    min_hp, max_hp = 10, 999
    
    regions = [
        ("主RAM", 0x80010000, 0x80090000),
    ]
    
    print(f"\n扫描HP范围: {min_hp}-{max_hp}")
    print("请稍候...\n")
    
    all_results = {}
    start_time = time.time()
    
    for name, start, end in regions:
        print(f"扫描 {name}...")
        results = scan_region(h, name, start, end, min_hp, max_hp)
        all_results.update(results)
        print(f"  找到 {len(results)} 个候选\n")
    
    elapsed = time.time() - start_time
    print(f"扫描完成! 耗时 {elapsed:.1f} 秒")
    print(f"共找到 {len(all_results)} 个候选地址\n")
    
    if all_results:
        print("候选地址:")
        for addr, val in sorted(all_results.items()):
            print(f"  0x{addr:X} = {val}")
        
        print(f"\n下次HP减少时告诉我，我会帮你更新这些地址!")
    else:
        print("未找到匹配地址")
    
    ctypes.windll.kernel32.CloseHandle(h)

if __name__ == "__main__":
    main()
