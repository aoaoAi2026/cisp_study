# Day 2：Python并发编程

> 🎯 面试目标：掌握Python并发编程在安全工具中的应用，理解多线程/多进程/异步的选型依据

## 知识速览

### 核心概念

- **GIL与安全工具选型**：Python的GIL（全局解释器锁）导致CPU密集型操作无法真正并行。对于网络扫描、暴力破解等IO密集型任务，多线程依然有效；对于密码破解、加密运算等CPU密集型任务，应使用`multiprocessing`或C扩展绕过GIL。

- **asyncio异步IO**：适合高并发网络请求场景（如批量HTTP探测、WebSocket安全测试）。`asyncio.gather()`并发执行多个协程，`aiohttp`提供异步HTTP客户端，单线程可处理数千并发连接。核心模式：`async def`定义协程，`await`挂起等待IO。

- **生产者-消费者模式**：安全工具中常见模式——生产者生成任务（如端口列表、URL列表），消费者处理任务（如扫描、检测）。使用`queue.Queue`（线程安全）或`asyncio.Queue`（异步）解耦生产和消费，配合`task_done()`和`join()`实现优雅退出。

- **concurrent.futures统一接口**：`ThreadPoolExecutor`和`ProcessPoolExecutor`提供统一的`submit`/`map`接口。`as_completed()`按完成顺序处理结果，适合安全扫描中实时输出发现的场景。

### 必问考点

| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| GIL是什么？对安全工具有什么影响？ | GIL是CPython解释器的全局锁，同一时刻只允许一个线程执行Python字节码。对于端口扫描（IO密集型）影响小，多线程仍能大幅提速；对于hash破解（CPU密集型），多线程反而可能因上下文切换变慢，应改用multiprocessing或调用C库（如hashcat的Python绑定）。 |
| 如何用asyncio实现一个高并发Web漏洞扫描器？ | 使用`aiohttp.ClientSession`复用连接，`asyncio.Semaphore`限制并发数避免被WAF封禁，`asyncio.as_completed()`实时处理扫描结果。关键：设置合理的`timeout`和`connector`限制，配合`try/except asyncio.TimeoutError`处理超时。 |
| 多线程扫描时如何控制速率避免被封？ | 使用`threading.Semaphore`控制最大并发数，`time.sleep(random.uniform(0.5, 2.0))`添加随机延迟。更高级的做法：令牌桶算法（Token Bucket）平滑流量，每秒发放固定数量令牌，请求前获取令牌。 |
| concurrent.futures中submit和map的区别？ | `submit(fn, *args)`提交单个任务返回Future对象，适合需要逐个处理结果或取消任务的场景；`map(fn, iterable)`批量提交，按提交顺序返回结果（阻塞），适合批量处理且不关心中间状态的场景。安全扫描建议用`submit`+`as_completed()`实时输出。 |

### 技术细节

```python
# 令牌桶限速器实现
import time
import threading

class TokenBucket:
    def __init__(self, rate, capacity):
        self.rate = rate          # 令牌生成速率（个/秒）
        self.capacity = capacity  # 桶容量
        self.tokens = capacity
        self.last_time = time.monotonic()
        self.lock = threading.Lock()

    def consume(self, tokens=1):
        with self.lock:
            now = time.monotonic()
            elapsed = now - self.last_time
            self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)
            self.last_time = now
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            return False

    def wait_and_consume(self, tokens=1):
        while not self.consume(tokens):
            time.sleep(0.1)
```

```python
# asyncio并发Web探测
import asyncio
import aiohttp

async def probe_url(session, url, semaphore, timeout=5):
    async with semaphore:
        try:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=timeout)) as resp:
                return url, resp.status, len(await resp.text())
        except Exception as e:
            return url, None, str(e)

async def batch_probe(urls, concurrency=20):
    semaphore = asyncio.Semaphore(concurrency)
    async with aiohttp.ClientSession() as session:
        tasks = [probe_url(session, url, semaphore) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
    return results
```

## 常见陷阱

- ⚠️ **线程过多反而变慢**：盲目使用几百个线程会因上下文切换开销导致性能下降。经验值：IO密集型任务线程数 = CPU核数 × (1 + 平均IO等待时间/CPU计算时间)，实践中50-200线程通常足够。用`concurrent.futures`的`max_workers`显式限制。

- ⚠️ **asyncio中混用阻塞调用**：在async函数中调用`time.sleep()`、`requests.get()`等阻塞函数会阻塞整个事件循环。应使用`await asyncio.sleep()`和`aiohttp`。如果不确定，可以用`loop.run_in_executor()`将阻塞调用放到线程池执行。

- ⚠️ **忘记处理KeyboardInterrupt**：安全工具运行时可能被Ctrl+C中断，需要注册信号处理器或捕获`KeyboardInterrupt`，确保资源（socket、文件、数据库连接）被正确释放。多进程场景需特别注意子进程的清理。

## 今日检测

1. 用`ThreadPoolExecutor`实现一个目录扫描器，从字典文件读取路径，对目标Web服务器批量探测，输出存在的路径和状态码。
2. 用asyncio实现一个子域名爆破工具，并发查询DNS A记录，支持自定义DNS服务器。
3. 实现生产者-消费者模型：生产者生成IP:Port组合放入Queue，多个消费者线程从Queue取出并执行TCP连接探测。
