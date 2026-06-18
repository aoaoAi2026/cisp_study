# Day 8：访问控制原理

> 🎯 面试目标：清晰阐述自主访问控制(DAC)、强制访问控制(MAC)、基于角色的访问控制(RBAC)的差异和应用场景

## 知识速览

### 核心概念
- **DAC（自主访问控制）**：资源所有者自主决定谁可以访问。如Windows NTFS权限、Linux文件权限。优点是灵活，缺点是无法控制信息流向（如用户A把机密文件复制后分享给B）
- **MAC（强制访问控制）**：系统根据标签和安全策略强制执行访问控制，用户无法自行更改。如SELinux、AppArmor。优点是严格的信息流控制，适用于军事和涉密系统
- **RBAC（基于角色的访问控制）**：权限不直接赋予用户，而是赋予角色，用户通过角色获得权限。企业中最常用的模型。面试重点：RBAC的3个核心实体（用户、角色、权限）及其关系

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| RBAC和ABAC有什么区别？ | RBAC基于角色分配权限，适合角色相对固定的场景；ABAC基于属性（用户属性+资源属性+环境属性）动态决策，更灵活但更复杂。实际企业往往RBAC为主、ABAC为辅。比如"部门经理可以访问本部门的数据"用RBAC，"仅在工作时间从公司IP访问"用ABAC补充 |
| 什么是最小权限原则？如何实施？ | 每个主体（用户/进程）只拥有完成其任务所需的最小权限。实施方法：定期权限审计、默认拒绝（白名单思维）、权限分级（read/write/admin分离）、JIT（Just-in-Time）权限申请。面试时最好结合具体场景举例 |
| 如何设计一个电商后台的权限系统？ | 使用RBAC模型。角色设计：超级管理员、运营经理、客服专员、仓库管理员、财务人员。权限设计：商品管理、订单管理、用户管理、退款审批、报表查看等。关键点：权限粒度到操作级别（增删改查），支持数据范围控制（如客服只能看自己处理的订单） |

### 技术细节

**三种访问控制模型对比：**
```
特性          DAC              MAC              RBAC
──────────────────────────────────────────────────────
控制粒度      粗              细              中
灵活性        高              低              中
管理复杂度    低              高              中
信息流控制    无              有              无（可配合）
典型实现      Linux权限        SELinux         AD组策略
适用场景      个人PC           军事/情报系统    企业应用
审计能力      弱              强              中
```

**RBAC权限数据库设计（简化ER模型）：**
```
user (id, username, ...)
role (id, role_name, description)
permission (id, resource, action, description)

user_role (user_id, role_id)        -- 用户-角色关联
role_permission (role_id, perm_id)  -- 角色-权限关联

-- 示例数据
permission: (1, 'order', 'read', '查看订单')
permission: (2, 'order', 'write', '修改订单')
permission: (3, 'order', 'delete', '删除订单')

role: (1, 'order_viewer', '订单查看员')
role_permission: (1, 1)  -- 角色1只有查看订单权限

role: (2, 'order_manager', '订单管理员')
role_permission: (2, 1), (2, 2), (2, 3)  -- 角色2有全部订单权限
```

**SELinux配置示例：**
```bash
# 查看进程的SELinux上下文
ps -eZ | grep httpd
# system_u:system_r:httpd_t:s0  9098 ?  00:00:01 httpd

# 查看文件的SELinux上下文
ls -Z /var/www/html/index.html
# -rw-r--r--. root root system_u:object_r:httpd_sys_content_t:s0 index.html

# 临时设置为Permissive模式（调试用）
setenforce 0

# 恢复为Enforcing模式
setenforce 1

# 查看审计日志（被拒绝的访问记录）
ausearch -m avc -ts recent
```

## 常见陷阱
- ⚠️ "我们用的是RBAC，所以权限管理很安全"——RBAC本身只是模型，安全性取决于实现。常见问题：角色爆炸（角色过多难以管理）、权限漂移（员工换岗后原权限未回收）、超级管理员过多
- ⚠️ 混淆MAC和DAC——关键区分点是"谁来决定访问权限"：DAC是资源所有者，MAC是系统安全策略。答错意味着基本概念不清

## 今日检测
1. 用RBAC模型设计一个GitHub仓库的权限体系（Owner/Maintainer/Write/Read等角色）
2. 解释为什么涉密系统必须使用MAC而不是DAC
3. 列举3种防止权限漂移的管理措施
