# Day 12：虚拟化与云安全
> [虚拟化安全面试核心] Hypervisor安全/VM Escape/容器安全/K8s SecurityContext
## 核心知识点
### Q: 虚拟化安全的核心挑战和防御
虚拟化(VMware/KVM/Hyper-V)安全：①Hypervisor攻击面→如果从Guest逃逸到Host→所有VM全沦陷(VENOM CVE-2015-3456) ②VM Escape→利用虚拟设备驱动(网卡/显卡)的漏洞打破沙箱 ③VM Sprawl→无人管理的快照+废弃VM成为攻击者的隐蔽据点 ④vMotion网络加密→如果不加密→攻击者嗅探VM迁移流量中的内存数据

K8s/容器安全的特殊问题：Pod中的/var/run/docker.sock挂载→攻击者从Pod完全控制Node→所有Pod沦陷。SecurityContext的privileged/allowPrivilegeEscalation误配置是容器安全问题的首要原因
## 面试陷阱
- Docker run -v /:/host可访问宿主机文件系统→docker组=root
- K8s的/var/run/docker.sock挂载→Pod中攻击者完全控制Node→安全101但面试中常漏

## 今日检测
1. 配置Docker --cap-drop=ALL --cap-add=NET_BIND_SERVICE→然后尝试mount宿主机→确认被阻止
2. 用kube-bench扫描K8s集群的CIS Compliance
