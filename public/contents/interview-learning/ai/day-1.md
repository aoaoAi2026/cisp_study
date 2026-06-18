# Day 1：Python安全编程强化

> 🎯 面试目标：掌握Python在安全领域的核心编程能力，能独立编写安全工具脚本

## 知识速览

### 核心概念

- **安全脚本工程化**：安全工具的代码必须注重错误处理、日志记录和输入验证，因为安全工具本身可能成为攻击面。使用`argparse`管理命令行参数，`logging`模块记录操作审计日志，`try/except`捕获所有外部调用异常。

- **Socket编程基础**：TCP/UDP Socket是网络扫描、端口探测、数据包构造的底层基础。`socket.socket(socket.AF_INET, socket.SOCK_STREAM)`创建TCP套接字，`socket.SOCK_RAW`需要root权限用于原始数据包构造。

- **Scapy数据包操作**：Scapy是安全工程师的"瑞士军刀"，能构造、发送、捕获、解析几乎所有网络协议的数据包。`IP(dst="target")/TCP(dport=80)`即可构造一个SYN包，`sr1()`发送并接收一个响应包。

- **正则表达式在安全中的应用**：日志解析、攻击特征提取、数据脱敏都离不开正则。`re.compile(r'(?P<ip>\d+\.\d+\.\d+\.\d+)')`配合命名组实现结构化日志提取。

### 必问考点

| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| Python中如何处理原始Socket？需要什么权限？ | 原始Socket通过`socket(AF_INET, SOCK_RAW, IPPROTO_RAW)`创建，需要root/Administrator权限。可以自定义IP头和TCP头，用于SYN扫描、IP欺骗等场景。Windows下原始Socket受限较大，通常建议在Linux环境下使用。 |
| 如何用Python编写一个端口扫描器？ | 核心思路：创建socket→设置超时→`connect_ex()`尝试连接→根据返回值判断端口状态。并发扫描用`concurrent.futures.ThreadPoolExecutor`提升速度。需注意不要过于频繁触发IDS/IPS告警，建议添加随机延迟。 |
| Scapy中如何构造和发送自定义数据包？ | 分层构造：`pkt = Ether()/IP(src="1.1.1.1", dst="2.2.2.2")/TCP(flags="S")/Raw(load="payload")`。发送用`send()`（仅发送）、`sendp()`（链路层发送）、`sr1()`（发送并接收一个响应）、`sr()`（发送并接收所有响应）。 |
| 安全脚本中如何处理大量日志文件？ | 使用生成器（`yield`）逐行读取避免内存溢出，`mmap`内存映射处理超大文件。结合`collections.Counter`进行频率统计，`re.finditer()`流式正则匹配。对于GB级别日志，考虑`subprocess`调用`grep`/`awk`预处理。 |

### 技术细节

```python
# 多线程端口扫描器核心代码
import socket
import concurrent.futures
import time

def scan_port(host, port, timeout=1):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    result = sock.connect_ex((host, port))
    sock.close()
    if result == 0:
        return port, "OPEN"
    return port, "CLOSED"

def port_scanner(host, ports, max_workers=50):
    results = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(scan_port, host, port): port for port in ports}
        for future in concurrent.futures.as_completed(futures):
            port, status = future.result()
            if status == "OPEN":
                results[port] = status
    return results
```

```python
# Scapy SYN扫描示例
from scapy.all import IP, TCP, sr1

def syn_scan(host, port, timeout=2):
    pkt = IP(dst=host)/TCP(dport=port, flags="S")
    resp = sr1(pkt, timeout=timeout, verbose=0)
    if resp is None:
        return "FILTERED"
    elif resp.haslayer(TCP):
        if resp[TCP].flags == 0x12:  # SYN-ACK
            # 发送RST关闭连接
            send(IP(dst=host)/TCP(dport=port, flags="R"), verbose=0)
            return "OPEN"
        elif resp[TCP].flags == 0x14:  # RST-ACK
            return "CLOSED"
    return "UNKNOWN"
```

## 常见陷阱

- ⚠️ **Socket资源泄漏**：忘记关闭socket连接会导致文件描述符耗尽，在高并发扫描时尤其致命。务必使用`with`语句或`try/finally`确保`sock.close()`被调用。

- ⚠️ **Scapy性能误区**：Scapy适合原型验证和小规模测试，但不适合大规模生产扫描。它的数据包构造在用户态完成，性能远不如内核态的iptables/nftables或专用工具如masscan。面试时要注意区分场景。

- ⚠️ **线程安全问题**：多线程扫描时共享资源（如结果列表）需要加锁，`threading.Lock`或使用线程安全的`queue.Queue`。Python的GIL对IO密集型任务（网络扫描）影响有限，但仍建议用`ThreadPoolExecutor`而非手动线程管理。

## 今日检测

1. 用Python写一个TCP全连接端口扫描器，支持CIDR网段输入（如192.168.1.0/24），输出开放端口列表。
2. 使用Scapy构造并发送一个带有自定义Payload的DNS查询包，解析响应中的A记录。
3. 编写一个正则表达式，从Apache/Nginx access log中提取IP、时间戳、请求方法、状态码和User-Agent。
