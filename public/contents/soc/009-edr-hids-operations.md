# EDR / HIDS 部署与运营实战：Wazuh + osquery 深入

---

## 一、Wazuh 生产级部署

```yaml
# 生产级架构：Wazuh Server集群 + Elasticsearch集群

# docker-compose.yml (单节点，中小型)
version: '3.7'
services:
  wazuh-manager:
    image: wazuh/wazuh-manager:4.7.3
    hostname: wazuh-manager
    restart: always
    ports:
      - "1514:1514/udp"    # Agent通信(syslog)
      - "1515:1515"         # Agent注册
      - "55000:55000"       # API
    volumes:
      - wazuh-data:/var/ossec/data
      - ./config/ossec.conf:/var/ossec/etc/ossec.conf

  wazuh-indexer:
    image: wazuh/wazuh-indexer:4.7.3
    environment:
      - "OPENSEARCH_JAVA_OPTS=-Xms2g -Xmx2g"
    ports:
      - "9200:9200"
    volumes:
      - wazuh-indexer:/var/lib/wazuh-indexer

  wazuh-dashboard:
    image: wazuh/wazuh-dashboard:4.7.3
    ports:
      - "5601:5601"
    environment:
      - INDEXER_URL=https://wazuh-indexer:9200
```

```bash
# Agent 自动化部署 (Ansible)
# deploy-wazuh-agent.yml
- name: Deploy Wazuh Agent
  hosts: all_servers
  tasks:
    - name: Add Wazuh repo
      yum_repository:
        name: wazuh
        description: Wazuh repository
        baseurl: https://packages.wazuh.com/4.x/yum/
        gpgcheck: yes
      when: ansible_os_family == "RedHat"
    
    - name: Install Wazuh Agent
      package:
        name: wazuh-agent
        state: present
    
    - name: Configure Agent
      template:
        src: ossec.conf.j2
        dest: /var/ossec/etc/ossec.conf
      notify: restart wazuh-agent
    
    - name: Start Agent
      service:
        name: wazuh-agent
        state: started
        enabled: yes
```

---

## 二、Wazuh 定制检测规则

```xml
<!-- /var/ossec/etc/rules/local_rules.xml -->

<group name="custom_detection,">
  <!-- 检测 WebShell 写入 -->
  <rule id="100100" level="12">
    <if_sid>554</if_sid>
    <field name="file" type="pcre2">\.php$|\.jsp$|\.asp$|\.aspx$</field>
    <description>Possible WebShell: PHP/JSP/ASP file created in web directory</description>
    <mitre>
      <id>T1505.003</id>
    </mitre>
  </rule>
  
  <!-- 检测密码文件访问 -->
  <rule id="100101" level="10">
    <if_sid>550</if_sid>
    <field name="file" type="pcre2">/etc/shadow|/etc/passwd|SAM</field>
    <description>Sensitive credential file accessed</description>
  </rule>
  
  <!-- 检测内核模块加载 -->
  <rule id="100102" level="12">
    <decoded_as>syscheck</decoded_as>
    <field name="file" type="pcre2">\.ko$</field>
    <description>Kernel module loaded: possible rootkit</description>
  </rule>
</group>
```

---

## 三、osquery 实战

```sql
-- osquery 常用安全查询

-- 查找所有监听端口
SELECT pid, port, address, protocol 
FROM listening_ports
WHERE port NOT IN (80, 443, 22, 3306, 8080, 8443);

-- 查找自启动项（Windows）
SELECT name, path, args 
FROM autoexec
WHERE path NOT LIKE 'C:\Windows\System32\%';

-- 查找自启动项（Linux cron）
SELECT command, path 
FROM crontab
WHERE command NOT LIKE '%logrotate%';

-- 最近修改的可执行文件
SELECT path, mtime, size
FROM file
WHERE path LIKE '/usr/bin/%' OR path LIKE '/usr/sbin/%'
  AND mtime > (SELECT local_time FROM time) - 86400;

-- 异常的SUID文件
SELECT path, uid, gid, mode, mtime
FROM suid_bin
WHERE path NOT LIKE '/usr/bin/%' 
  AND path NOT LIKE '/usr/sbin/%';
```

---

## 四、Agent 运维管理

```
Agent 健康监控要点：

  ✦ 在线率：Agent状态监控（Connected/Disconnected）
  ✦ Agent版本：自动升级策略（小版本自动+大版本审批）
  ✦ 资源消耗：CPU < 2%, Memory < 200MB
  ✦ 日志丢失率：< 0.1%
  ✦ 配置同步：配置变更后批量推送

故障排查三步法：
  ① 检查Agent进程: systemctl status wazuh-agent
  ② 检查日志: tail -f /var/ossec/logs/ossec.log
  ③ 检查网络连通: telnet manager_ip 1514
```

---

## 五、Checklist

- [ ] Wazuh Server生产级部署（集群+ES）
- [ ] Agent覆盖率 > 95%
- [ ] 自定义检测规则编写 > 20条
- [ ] osquery Fleet部署
- [ ] Agent自动化部署脚本（Ansible/Puppet）
- [ ] Agent健康监控与自动拉起
- [ ] 规则定期审计（≥季度）
