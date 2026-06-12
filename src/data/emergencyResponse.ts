export interface EmergencyScenario {
  id: string;
  title: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  impact: string;
  affectedSectors: string[];
  overview: string;
  phases: EmergencyPhase[];
  checklists: ChecklistSection[];
  scripts?: ScriptItem[];
  caseStudies?: CaseStudy[];
}

export interface EmergencyPhase {
  phase: string;
  duration: string;
  actions: Action[];
}

export interface Action {
  step: number;
  title: string;
  description: string;
  commands?: CommandItem[];
  responsible: string;
  tools?: string[];
  verification?: string;
}

export interface CommandItem {
  description: string;
  command: string;
  platform: 'Windows' | 'Linux' | 'Both';
  output?: string;
  risk?: string;
}

export interface ChecklistSection {
  section: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  item: string;
  priority: 'critical' | 'high' | 'medium';
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface ScriptItem {
  name: string;
  description: string;
  language: string;
  content: string;
  platform: string;
}

export interface CaseStudy {
  title: string;
  organization: string;
  incident: string;
  timeline: { time: string; event: string }[];
  lessons: string[];
}

// 网络安全应急处理场景数据
export const emergencyScenarios: EmergencyScenario[] = [
  // ==================== 勒索病毒应急处理 ====================
  {
    id: 'ransomware-general',
    title: '勒索病毒攻击应急处理方案（通用版）',
    category: '勒索病毒',
    severity: 'critical',
    impact: '文件被加密、系统无法使用、数据可能永久丢失',
    affectedSectors: ['所有行业', '政府', '企业', '医疗机构'],
    overview: '勒索病毒是目前最具破坏性的网络威胁之一。一旦感染，系统中的文件将被加密并无法访问，攻击者通常要求支付赎金获取解密密钥。本方案提供从发现、遏制、 eradication到恢复的完整处理流程，适用于各类组织机构。',
    phases: [
      {
        phase: '第一阶段：发现与初步评估（0-1小时）',
        duration: '1小时内完成',
        actions: [
          {
            step: 1,
            title: '确认勒索病毒感染',
            description: '识别是否真的感染了勒索病毒，注意区分勒索病毒与其他恶意软件。典型特征：文件扩展名被篡改（如.doc变成.doc.locked）、桌面出现勒索信、系统运行异常缓慢、弹出勒索信息窗口。',
            commands: [
              { description: '检查异常文件扩展名', command: 'Get-ChildItem -Path C:\\ -Recurse -File | Where-Object { $_.Extension -match "locked|encrypted|encrypted| crypto" } | Select-Object FullName', platform: 'Windows' },
              { description: '查找勒索信文件', command: 'Get-ChildItem -Path C:\\ -Recurse -File -Include "*-READ-ME*","*-HOW-TO-DECRYPT*","*-DECRYPT*","README*","RECOVERY*"', platform: 'Windows' },
              { description: '查找可疑进程', command: 'tasklist /v | findstr /i "random|suspicious|encrypt|locked"', platform: 'Windows' },
              { description: '检查启动项中的恶意条目', command: 'reg query HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', platform: 'Windows' }
            ],
            responsible: 'IT运维人员、安全团队',
            tools: ['Process Explorer', 'Autoruns', 'Process Hacker'],
            verification: '确认勒索信存在且系统有加密痕迹'
          },
          {
            step: 2,
            title: '隔离受感染主机',
            description: '立即断开受感染主机与网络的连接，防止勒索病毒扩散到其他系统。拔掉网线或禁用网络适配器。',
            commands: [
              { description: '禁用网络适配器', command: 'Get-NetAdapter | Disable-NetAdapter -Confirm:$false', platform: 'Windows' },
              { description: '断开网络连接', command: 'netsh interface set interface "Ethernet" disabled', platform: 'Windows' },
              { description: 'Linux下断开网络', command: 'sudo ifconfig eth0 down', platform: 'Linux' },
              { description: '立即关闭可能传播的服务', command: 'net stop smb', platform: 'Windows' }
            ],
            responsible: 'IT运维人员',
            verification: '主机已断开网络连接'
          },
          {
            step: 3,
            title: '初步评估影响范围',
            description: '快速评估受影响的系统数量和重要程度，确定事件严重程度。',
            commands: [
              { description: '检查同一网段的其他主机', command: 'Get-NetComputer -防火墙上查看 | Out-GridView', platform: 'Windows' },
              { description: '检查共享文件是否被加密', command: 'Get-ChildItem -Path \\\\Server\\Share -Recurse -File | Where-Object { $_.LastWriteTime -gt (Get-Date).AddHours(-24) }', platform: 'Windows' },
              { description: '检查日志中的异常登录', command: 'wevtutil qe Security /c:50 /f:text | findstr /i "logon failed|anomalous"', platform: 'Windows' }
            ],
            responsible: '安全团队',
            verification: '形成初步的影响评估报告'
          },
          {
            step: 4,
            title: '启动应急响应团队',
            description: '通知应急响应团队成员，明确职责分工。包括IT运维、安全团队、法务、公关、管理层。',
            responsible: '应急响应负责人',
            tools: ['应急预案文档', '联系人列表']
          }
        ]
      },
      {
        phase: '第二阶段：遏制与控制（1-4小时）',
        duration: '3小时内完成',
        actions: [
          {
            step: 5,
            title: '全网断网（必要时）',
            description: '如果勒索病毒通过内网传播，需要果断切断整个网络。关闭核心交换机，通知所有部门。',
            commands: [
              { description: '关闭域控制器', command: 'shutdown /m \\\\DC01 /r /c "Emergency Shutdown - Ransomware"', platform: 'Windows' },
              { description: '隔离所有服务器', command: 'foreach ($srv in @("DC01","DB01","APP01")) { shutdown /m \\\\ $srv /r /c "Emergency" }', platform: 'Windows' }
            ],
            responsible: 'IT主管',
            verification: '所有关键系统已隔离'
          },
          {
            step: 6,
            title: '禁用域管理员账户',
            description: '防止攻击者利用泄露的管理员凭据继续在内网移动。',
            commands: [
              { description: '禁用域管理员', command: 'net user "Administrator" /active:no /domain', platform: 'Windows' },
              { description: '禁用其他特权账户', command: 'Get-ADUser -Filter * -Properties MemberOf | Where-Object { $_.MemberOf -contains "Domain Admins" } | Disable-ADAccount', platform: 'Windows' },
              { description: '重置所有管理员密码', command: 'net user Administrator NewStrongPassword123! /domain', platform: 'Windows' }
            ],
            responsible: '域管理员',
            verification: '所有特权账户已禁用或密码已重置'
          },
          {
            step: 7,
            title: '切断SMB等高危端口',
            description: '如果勒索病毒通过SMB漏洞传播，立即关闭相关端口。',
            commands: [
              { description: '在防火墙上阻止445端口', command: 'netsh advfirewall firewall add rule name="Block SMB" dir=in action=block protocol=TCP localport=445,139,138,137', platform: 'Windows' },
              { description: '禁用SMBv1', command: 'Set-SmbServerConfiguration -RequireSecuritySignature $true -EnableSMB1Protocol $false -Force', platform: 'Windows' },
              { description: 'Linux下阻止SMB端口', command: 'sudo iptables -A INPUT -p tcp --dport 445 -j DROP', platform: 'Linux' }
            ],
            responsible: 'IT运维',
            verification: '445端口已被阻止'
          },
          {
            step: 8,
            title: '收集攻击痕迹',
            description: '在清除前收集证据，包括恶意软件样本、日志、网络流量。',
            commands: [
              { description: '导出勒索信', command: 'Get-ChildItem -Path C:\\ -Recurse -File | Where-Object { $_.Name -like "*READ*" } | Copy-Item -Destination C:\\Forensics', platform: 'Windows' },
              { description: '导出系统日志', command: 'wevtutil epl System C:\\Forensics\\SystemLog.evtx', platform: 'Windows' },
              { description: '导出安全日志', command: 'wevtutil epl Security C:\\Forensics\\SecurityLog.evtx', platform: 'Windows' },
              { description: '收集内存镜像', command: 'WinPmem64.exe C:\\Forensics\\memory.raw', platform: 'Windows' }
            ],
            responsible: '安全团队/取证人员',
            tools: ['WinPmem', 'FTK Imager', 'KAPE']
          }
        ]
      },
      {
        phase: '第三阶段： eradication（清除）',
        duration: '根据情况而定',
        actions: [
          {
            step: 9,
            title: '确定勒索病毒家族',
            description: '识别勒索病毒的具体类型，确定是否有解密工具可用。这是关键步骤，错误的清除可能破坏数据。',
            commands: [
              { description: '识别勒索信中的标识', command: 'Get-Content "C:\\*-READ-ME*.txt"', platform: 'Windows' },
              { description: '在线查询勒索病毒类型', command: '访问nomoreransom.org或ID Ransomware进行识别', platform: 'Both' },
              { description: '提取勒索病毒样本', command: 'Get-ChildItem -Path $env:TEMP -Recurse -File | Copy-Item -Destination C:\\Forensics\\Ransomware', platform: 'Windows' }
            ],
            responsible: '安全团队',
            tools: ['ID Ransomware', 'No More Ransom Project', 'VirusTotal']
          },
          {
            step: 10,
            title: '检查是否有解密工具',
            description: '很多勒索病毒已有解密工具，在支付赎金前务必检查。',
            commands: [
              { description: '访问No More Ransom检查解密工具', command: 'nomoreransom.org', platform: 'Both' },
              { description: '使用Emsisoft解密工具测试', command: 'ransomware_decryption_tool.exe --scan', platform: 'Both' }
            ],
            responsible: '安全团队',
            verification: '确认是否有可用解密工具'
          },
          {
            step: 11,
            title: '格式化并重装受感染系统',
            description: '格式化系统盘，重新安装操作系统和应用程序。确保数据盘先断开。',
            commands: [
              { description: '备份重要数据（如果可能）', command: 'robocopy C:\\ImportantData \\\\BackupServer\\ImportantData /E /ZB /R:3 /W:5', platform: 'Windows' },
              { description: '格式化系统盘', command: 'format C: /FS:NTFS /Q', platform: 'Windows' },
              { description: '使用WIM镜像恢复', command: 'DISM /Apply-Image /ImageFile:WinRE.wim /Index:1 /ApplyDir:C:\\', platform: 'Windows' }
            ],
            responsible: 'IT运维',
            tools: ['Windows安装介质', 'PE启动盘']
          }
        ]
      },
      {
        phase: '第四阶段：恢复',
        duration: '数天到数周',
        actions: [
          {
            step: 12,
            title: '从备份恢复数据',
            description: '使用干净的备份恢复系统和数据。确保备份是在勒索病毒入侵前创建的。',
            commands: [
              { description: '检查备份完整性', command: 'wbadmin get versions', platform: 'Windows' },
              { description: '执行系统还原', command: 'wbadmin start recovery -version:版本号 -itemtype:Volume -items:C: -recoverytarget:C:', platform: 'Windows' },
              { description: '恢复文件级备份', command: 'Restore-Computer -Path "\\\\BackupServer\\Backup" -BackupID "版本ID"', platform: 'Windows' }
            ],
            responsible: 'IT运维',
            verification: '系统和数据已成功恢复'
          },
          {
            step: 13,
            title: '修复漏洞和安全加固',
            description: '修复导致勒索病毒入侵的漏洞，防止再次感染。',
            commands: [
              { description: '安装所有安全更新', command: 'Get-WindowsUpdate -Install -All', platform: 'Windows' },
              { description: '安装终端防护软件', command: '\\InstallServer\\EndpointProtection.exe /quiet /norestart', platform: 'Windows' },
              { description: '配置Windows Defender', command: 'Set-MpPreference -DisableRealtimeMonitoring $false -SubmitSamplesConsent Always', platform: 'Windows' },
              { description: '启用应用白名单', command: 'Set-ExecutionPolicy Restricted', platform: 'Windows' }
            ],
            responsible: '安全团队',
            tools: ['WSUS', 'SCCM', 'Intune']
          },
          {
            step: 14,
            title: '恢复业务系统',
            description: '按优先级恢复关键业务系统，确保安全的前提下逐步恢复服务。',
            responsible: 'IT运维 + 业务部门',
            verification: '关键业务系统已恢复运行'
          }
        ]
      }
    ],
    checklists: [
      {
        section: '初始响应清单',
        items: [
          { item: '确认勒索病毒感染', priority: 'critical' },
          { item: '隔离受感染主机（拔网线）', priority: 'critical' },
          { item: '评估影响范围', priority: 'critical' },
          { item: '启动应急响应团队', priority: 'high' },
          { item: '切断网络防止扩散', priority: 'critical' },
          { item: '禁用特权账户', priority: 'high' }
        ]
      },
      {
        section: '遏制阶段清单',
        items: [
          { item: '关闭SMB等高危端口', priority: 'high' },
          { item: '收集攻击证据和日志', priority: 'high' },
          { item: '识别勒索病毒类型', priority: 'high' },
          { item: '检查是否有解密工具', priority: 'critical' },
          { item: '通知相关监管机构（如需要）', priority: 'high' }
        ]
      },
      {
        section: '恢复阶段清单',
        items: [
          { item: '从干净备份恢复系统', priority: 'critical' },
          { item: '安装所有安全补丁', priority: 'critical' },
          { item: '配置终端防护软件', priority: 'critical' },
          { item: '进行安全加固', priority: 'high' },
          { item: '逐步恢复业务系统', priority: 'high' },
          { item: '事后复盘和改进', priority: 'medium' }
        ]
      }
    ],
    scripts: [
      {
        name: '勒索病毒快速检测脚本',
        description: '检测系统中是否存在勒索病毒迹象',
        language: 'PowerShell',
        platform: 'Windows',
        content: "# 勒索病毒快速检测脚本\n# 保存为: Detect-Ransomware.ps1\n\nWrite-Host \"=== 勒索病毒检测开始 ===\" -ForegroundColor Yellow\n\n# 检测可疑进程\nWrite-Host \"`n[1] 检测可疑进程...\" -ForegroundColor Cyan\n$suspicious = Get-Process | Where-Object {\n    $_.ProcessName -match \"encrypt|locked|crypto|ransom|bitcoin\" -or\n    $_.ProcessName -match \"random|suspicious\" -and $_.Company -match \"Unknown\"\n}\nif ($suspicious) {\n    Write-Host \"发现可疑进程!\" -ForegroundColor Red\n    $suspicious | Format-Table Name, Id, Path\n} else {\n    Write-Host \"未发现可疑进程\" -ForegroundColor Green\n}\n\n# 检测勒索信文件\nWrite-Host \"`n[2] 检测勒索信文件...\" -ForegroundColor Cyan\n$ransomNotes = Get-ChildItem -Path C:\\ -Recurse -File -ErrorAction SilentlyContinue |\n    Where-Object {\n        $_.Name -match \"READ|DECRYPT|HELP|RECOVERY\" -or\n        $_.Extension -match \"locked|encrypted|crypto\"\n    }\nif ($ransomNotes) {\n    Write-Host \"发现勒索信文件!\" -ForegroundColor Red\n    $ransomNotes | Select-Object FullName, LastWriteTime | Format-Table\n} else {\n    Write-Host \"未发现勒索信文件\" -ForegroundColor Green\n}\n\n# 检测异常的文件加密\nWrite-Host \"`n[3] 检测近期大量文件修改...\" -ForegroundColor Cyan\n$recentModified = Get-ChildItem -Path C:\\ -Recurse -File -ErrorAction SilentlyContinue |\n    Where-Object { $_.LastWriteTime -gt (Get-Date).AddHours(-24) } |\n    Group-Object Extension |\n    Sort-Object Count -Descending |\n    Select-Object -First 10\nWrite-Host \"最近24小时内修改的文件类型统计:\"\n$recentModified | Format-Table Name, Count\n\n# 检测网络连接\nWrite-Host \"`n[4] 检测可疑网络连接...\" -ForegroundColor Cyan\n$connections = Get-NetTCPConnection -State Established |\n    Where-Object { $_.RemoteAddress -not match \"^192\\\\.168|^10\\\\.|^172\\\\.(1[6-9]|2[0-9]|3[01])\\\\$\" }\nif ($connections) {\n    Write-Host \"发现可疑外部连接:\" -ForegroundColor Yellow\n    $connections | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess |\n        Format-Table\n} else {\n    Write-Host \"未发现可疑外部连接\" -ForegroundColor Green\n}\n\nWrite-Host \"`n=== 检测完成 ===\" -ForegroundColor Yellow"
      },
      {
        name: '快速隔离脚本',
        description: '紧急情况下快速隔离受感染主机',
        language: 'PowerShell',
        platform: 'Windows',
        content: "# 快速隔离脚本 - 紧急情况下使用\n# 保存为: Emergency-Isolate.ps1\n# 需要管理员权限运行\n\nparam(\n    [switch]$Force\n)\n\nif (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {\n    Write-Host \"需要管理员权限!\" -ForegroundColor Red\n    exit 1\n}\n\nWrite-Host \"=== 紧急隔离开始 ===\" -ForegroundColor Red\nWrite-Host \"正在断开网络连接...\" -ForegroundColor Yellow\n\n# 禁用所有网络适配器\ntry {\n    Get-NetAdapter | Where-Object { $_.Status -eq \"Up\" } | Disable-NetAdapter -Confirm:$false -ErrorAction Stop\n    Write-Host \"[OK] 网络适配器已禁用\" -ForegroundColor Green\n} catch {\n    Write-Host \"[警告] 无法禁用网络适配器: $_\" -ForegroundColor Yellow\n}\n\n# 阻止445端口入站连接\nWrite-Host \"正在阻止SMB端口...\" -ForegroundColor Yellow\ntry {\n    New-NetFirewallRule -DisplayName \"EMERGENCY Block SMB\" `\n        -Direction Inbound `\n        -Action Block `\n        -Protocol TCP `\n        -LocalPort 445,139,138,137 `\n        -ErrorAction SilentlyContinue\n    Write-Host \"[OK] SMB端口已阻止\" -ForegroundColor Green\n} catch {\n    Write-Host \"[警告] 无法阻止SMB端口\" -ForegroundColor Yellow\n}\n\n# 禁用可移动介质自动运行\nWrite-Host \"正在禁用自动运行...\" -ForegroundColor Yellow\nSet-ItemProperty -Path \"HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer\" -Name \"NoDriveTypeAutoRun\" -Value 255\n\n# 记录隔离操作\n$log = \"C:\\Forensics\\Isolation_$(Get-Date -Format 'yyyyMMdd_HHmmss').log\"\nmkdir C:\\Forensics -Force | Out-Null\n\"Isolation performed at $(Get-Date)\" | Out-File -FilePath $log\n\nWrite-Host \"`n隔离完成!\" -ForegroundColor Red\nWrite-Host \"请立即联系安全团队\" -ForegroundColor Yellow\nWrite-Host \"隔离日志: $log\""
      }
    ],
    caseStudies: [
      {
        title: '某三甲医院勒索病毒事件',
        organization: '某三甲医院',
        incident: '2019年，医院HIS系统感染勒索病毒，导致门诊挂号、药房取药、检验系统全面瘫痪，影响数千名患者就医。',
        timeline: [
          { time: '周一 08:30', event: '护士站电脑弹出勒索信息，发现部分文件被加密' },
          { time: '08:45', event: 'IT部门接到报告，初步确认为勒索病毒' },
          { time: '09:00', event: '紧急隔离受感染电脑，但已通过内网传播' },
          { time: '09:30', event: 'HIS服务器全面瘫痪，系统无法登录' },
          { time: '10:00', event: '启动应急预案，切换到手工模式' },
          { time: '12:00', event: '决定不支付赎金，开始从备份恢复' },
          { time: '周三 18:00', event: '核心系统恢复上线' }
        ],
        lessons: [
          '内网缺乏分段隔离，导致快速传播',
          '备份策略不完善，部分数据无法恢复',
          '应急演练不足，响应混乱',
          '缺乏终端防护软件',
          '员工安全意识薄弱，打开了钓鱼邮件附件'
        ]
      }
    ]
  },

  // ==================== 医院行业勒索病毒处理 ====================
  {
    id: 'ransomware-hospital',
    title: '医院勒索病毒应急处理方案（医疗行业专版）',
    category: '勒索病毒',
    severity: 'critical',
    impact: '医疗服务中断、患者数据泄露、系统全面瘫痪',
    affectedSectors: ['医院', '诊所', '医疗集团', '医保系统'],
    overview: '医院是勒索病毒攻击的高发目标，一旦感染可能导致医疗服务全面中断，危及患者生命安全。本方案针对医院的特殊需求，重点关注HIS系统、PACS系统、LIS系统等关键医疗系统的应急处理，同时考虑患者安全和医疗法规要求。',
    phases: [
      {
        phase: '第一阶段：紧急响应（0-30分钟）',
        duration: '30分钟内完成',
        actions: [
          {
            step: 1,
            title: '启动医疗信息系统应急预案',
            description: '医院信息科主任启动《医院信息系统安全事件应急预案》，通知相关人员到位。根据事件级别决定是否上报院领导。',
            responsible: '信息科主任/值班员',
            tools: ['应急预案文档', '应急联系人表']
          },
          {
            step: 2,
            title: '紧急评估业务影响',
            description: '快速评估各系统受影响情况，确定关键优先级：1) 影响患者生命的系统优先；2) 涉及急诊、手术的系统优先；3) 数据敏感度高的系统优先。',
            commands: [
              { description: '检查HIS系统状态', command: 'sc query "HISService" | findstr STATE', platform: 'Windows' },
              { description: '检查数据库连接', command: 'sqlcmd -S DBServer -Q "SELECT COUNT(*) FROM sys.dm_exec_sessions"', platform: 'Windows' },
              { description: '检查PACS存储状态', command: 'Get-ChildItem \\\\PACS\\Storage -ErrorAction SilentlyContinue | Measure-Object', platform: 'Windows' }
            ],
            responsible: '信息科技术骨干',
            verification: '形成业务影响评估表'
          },
          {
            step: 3,
            title: '关键系统紧急隔离',
            description: '立即隔离可能影响患者安全的系统，优先保障急诊、ICU等关键区域。',
            commands: [
              { description: '隔离HIS应用服务器', command: 'shutdown /m \\\\HISSVR01 /r /c "Emergency" /t 0', platform: 'Windows' },
              { description: '隔离数据库服务器', command: 'shutdown /m \\\\DB01 /r /c "Emergency" /t 0', platform: 'Windows' },
              { description: '断开PACS存储', command: 'net use \\\\PACS\\Storage /delete /y', platform: 'Windows' }
            ],
            responsible: '系统管理员',
            verification: '关键系统已隔离'
          },
          {
            step: 4,
            title: '切换到手工模式',
            description: '启动手工操作预案，确保基本医疗服务不中断。通知各科室使用纸质单据和手工记录。',
            responsible: '医务科、信息科',
            tools: ['手工记录本', '纸质单据模板']
          }
        ]
      },
      {
        phase: '第二阶段：遏制与评估（30分钟-2小时）',
        duration: '1.5小时内完成',
        actions: [
          {
            step: 5,
            title: '全院网络隔离',
            description: '关闭院内网络核心交换机，防止勒索病毒进一步传播。通知各科室使用单机操作。',
            commands: [
              { description: '登录核心交换机', command: 'ssh admin@Core-Switch', platform: 'Linux' },
              { description: '关闭所有VLAN', command: 'configure terminal; no vlan 10; no vlan 20; no vlan 30; end; write', platform: 'Linux' },
              { description: '关闭无线网络', command: 'configure terminal; no wlan-controller; end; write', platform: 'Linux' }
            ],
            responsible: '网络管理员',
            verification: '院内网络已全面隔离'
          },
          {
            step: 6,
            title: '评估数据损失',
            description: '评估各系统的数据损失情况，重点关注患者数据、处方数据、检查报告等。',
            commands: [
              { description: '检查患者数据完整性', command: 'sqlcmd -S DB01 -d HIS -Q "SELECT COUNT(*) FROM PatientReg WHERE RegDate >= GETDATE()-1"', platform: 'Windows' },
              { description: '检查处方数据', command: 'sqlcmd -S DB01 -d HIS -Q "SELECT TOP 10 * FROM Prescription ORDER BY CreateTime DESC"', platform: 'Windows' },
              { description: '统计加密文件数量', command: 'Get-ChildItem D:\\HISData -Recurse -File | Where-Object { $_.Extension -match "encrypted|locked" } | Measure-Object', platform: 'Windows' }
            ],
            responsible: 'DBA + 科室负责人'
          },
          {
            step: 7,
            title: '联系上级主管部门',
            description: '根据医疗信息安全要求，向卫健委等主管部门报告安全事件。',
            responsible: '院办/信息科主任',
            tools: ['上级主管部门联系方式', '事件报告模板']
          }
        ]
      },
      {
        phase: '第三阶段：恢复（2小时-数天）',
        duration: '根据情况而定',
        actions: [
          {
            step: 8,
            title: '制定分阶段恢复计划',
            description: '根据业务优先级制定恢复计划：1) 第一优先：急诊系统、手术室系统；2) 第二优先：门诊系统、药房系统；3) 第三优先：行政系统、科研系统。',
            responsible: '信息科主任 + 医务科'
          },
          {
            step: 9,
            title: '恢复核心数据库',
            description: '从备份恢复HIS数据库，确保患者数据完整性。',
            commands: [
              { description: '检查备份状态', command: 'list backup history for database HIS', platform: 'Windows' },
              { description: '执行数据库还原', command: 'RESTORE DATABASE HIS FROM DISK=\'\\\\Backup\\HIS_FULL.bak\' WITH NORECOVERY, REPLACE', platform: 'Windows' },
              { description: '应用日志备份', command: 'RESTORE LOG HIS FROM DISK=\'\\\\Backup\\HIS_LOG.trn\' WITH RECOVERY', platform: 'Windows' },
              { description: '验证数据完整性', command: 'sqlcmd -S DB01 -d HIS -Q "DBCC CHECKDB(\'HIS\')"', platform: 'Windows' }
            ],
            responsible: 'DBA团队',
            tools: ['SQL Server Management Studio', '备份管理软件']
          },
          {
            step: 10,
            title: '恢复应用系统',
            description: '按照优先级逐个恢复应用系统，确保每个系统上线前经过安全检查。',
            commands: [
              { description: '全新安装应用服务器', command: '格式化后使用镜像恢复或全新安装', platform: 'Windows' },
              { description: '安装安全补丁', command: 'Get-WindowsUpdate -Install -All -AcceptAll', platform: 'Windows' },
              { description: '部署终端防护', command: 'msiexec /i EndpointProtection.msi /quiet', platform: 'Windows' },
              { description: '验证系统功能', command: '启动HIS服务并检查日志', platform: 'Windows' }
            ],
            responsible: '系统管理员 + 应用管理员'
          },
          {
            step: 11,
            title: '分批次恢复科室接入',
            description: '按照科室优先级逐个恢复网络接入，每次恢复后进行安全检查。',
            commands: [
              { description: '恢复一个VLAN', command: 'configure terminal; vlan 10; name Outpatient; end; write', platform: 'Linux' },
              { description: '检查接入终端安全状态', command: '逐台检查终端防护软件状态和系统补丁', platform: 'Both' },
              { description: '监控网络异常', command: '观察防火墙日志和网络流量', platform: 'Both' }
            ],
            responsible: '网络管理员 + 安全管理员'
          }
        ]
      }
    ],
    checklists: [
      {
        section: '医疗系统特殊检查清单',
        items: [
          { item: '患者数据完整性验证', priority: 'critical' },
          { item: '处方和医嘱数据核查', priority: 'critical' },
          { item: '检查报告数据恢复', priority: 'high' },
          { item: '医保结算数据核对', priority: 'high' },
          { item: '医疗影像数据检查', priority: 'high' },
          { item: '与临床科室确认数据', priority: 'high' }
        ]
      },
      {
        section: '合规报告清单',
        items: [
          { item: '向卫健委报告', priority: 'critical' },
          { item: '向网信办报告（如涉及重要数据）', priority: 'high' },
          { item: '向公安机关网安部门报告', priority: 'high' },
          { item: '患者知情通知（如数据泄露）', priority: 'critical' },
          { item: '保险报案（如有网络安全险）', priority: 'medium' }
        ]
      }
    ]
  },

  // ==================== 政务系统勒索病毒处理 ====================
  {
    id: 'ransomware-government',
    title: '政务系统勒索病毒应急处理方案（政府专版）',
    category: '勒索病毒',
    severity: 'critical',
    impact: '政务服务中断、敏感数据泄露、政府形象受损',
    affectedSectors: ['政府机关', '事业单位', '公共服务部门'],
    overview: '政务系统承载着大量的敏感政务数据和公民个人信息，一旦感染勒索病毒，不仅影响政务服务，还可能造成敏感信息泄露。本方案针对政务系统的特点，强调数据安全和合规要求，同时确保政务服务的基本连续性。',
    phases: [
      {
        phase: '第一阶段：紧急响应与上报（0-1小时）',
        duration: '1小时内完成',
        actions: [
          {
            step: 1,
            title: '立即上报主管部门',
            description: '政务系统发生安全事件，必须第一时间向上级主管部门报告。按照《网络安全法》要求，一般事件24小时内上报，重大事件立即上报。',
            responsible: '信息中心主任/值班员',
            tools: ['上级主管部门联系方式', '应急通信录']
          },
          {
            step: 2,
            title: '启动政务网络安全应急预案',
            description: '启动《政务网络与信息安全应急预案》，成立应急处置指挥部，明确各成员单位职责。',
            responsible: '信息中心主任',
            tools: ['应急预案', '组织架构图']
          },
          {
            step: 3,
            title: '评估事件等级',
            description: '根据影响范围、数据敏感度、业务影响程度，初步判定事件等级（一般/较大/重大/特别重大）。',
            responsible: '技术专家组',
            verification: '形成事件等级初步判定报告'
          },
          {
            step: 4,
            title: '紧急隔离措施',
            description: '对涉事系统和相关联的系统采取紧急隔离措施，防止事态扩大。',
            commands: [
              { description: '断开政务外网边界防火墙', command: '登录防火墙，将涉事网段设置为deny all', platform: 'Both' },
              { description: '关闭互联网访问', command: '禁用互联网出口', platform: 'Both' },
              { description: '隔离核心数据区域', command: '核心交换机上断开敏感VLAN', platform: 'Both' }
            ],
            responsible: '网络管理员',
            verification: '政务网络边界已隔离'
          }
        ]
      },
      {
        phase: '第二阶段：应急处置（1-4小时）',
        duration: '3小时内完成',
        actions: [
          {
            step: 5,
            title: '现场取证与证据固定',
            description: '在保证数据完整性的前提下，收集攻击证据和日志。',
            commands: [
              { description: '导出安全日志', command: 'wevtutil epl Security C:\\Logs\\Security_$(Get-Date -Format yyyyMMdd).evtx', platform: 'Windows' },
              { description: '导出系统日志', command: 'wevtutil epl System C:\\Logs\\System_$(Get-Date -Format yyyyMMdd).evtx', platform: 'Windows' },
              { description: '抓取内存镜像', command: 'winpmem_mini_x64.exe memory.raw', platform: 'Windows' },
              { description: '磁盘镜像', command: 'dcfldd if=/dev/sda of=/mnt/evidence/disk.img hash=md5,sha256', platform: 'Linux' }
            ],
            responsible: '取证人员',
            tools: ['FTK Imager', 'WinPmem', 'dcfldd']
          },
          {
            step: 6,
            title: '联系网络安全服务商',
            description: '通知签约的网络安全服务商，派人现场支持应急处置。',
            responsible: '信息中心',
            tools: ['服务商联系方式', '服务合同']
          },
          {
            step: 7,
            title: '评估数据泄露风险',
            description: '重点评估公民个人信息、政府内部敏感数据是否被窃取或泄露。',
            commands: [
              { description: '检查敏感文件访问日志', command: 'Get-WinEvent -LogName Security | Where-Object { $_.Message -match "Sensitive|Files" }', platform: 'Windows' },
              { description: '检查数据外发记录', command: '检查防火墙日志中的大数据量外发连接', platform: 'Both' },
              { description: '检查云存储同步', command: '检查OneDrive、百度网盘等是否有敏感文件同步', platform: 'Windows' }
            ],
            responsible: '安全专家 + 保密办'
          }
        ]
      },
      {
        phase: '第三阶段：恢复与整改',
        duration: '数天到数周',
        actions: [
          {
            step: 8,
            title: '制定恢复方案',
            description: '在上级主管部门指导下，制定系统恢复方案。涉及等保三级以上系统的，需经专家评审。',
            responsible: '技术专家组 + 上级主管部门'
          },
          {
            step: 9,
            title: '恢复政务服务',
            description: '优先恢复面向公众的政务服务，如政务网站、网上办事大厅等。',
            commands: [
              { description: '全新安装政务网站服务器', command: '格式化重装后恢复', platform: 'Both' },
              { description: '从安全备份恢复数据', command: '确保备份无病毒后恢复', platform: 'Both' },
              { description: '安全加固后上线', command: '通过安全检测后恢复服务', platform: 'Both' }
            ],
            responsible: '运维团队'
          },
          {
            step: 10,
            title: '事后整改与复盘',
            description: '事件处置完成后，进行全面复盘，形成整改报告，上报主管部门。',
            responsible: '信息中心 + 安全专家',
            tools: ['复盘报告模板', '整改计划表']
          }
        ]
      }
    ],
    checklists: [
      {
        section: '政务合规必检清单',
        items: [
          { item: '向网信部门报告', priority: 'critical' },
          { item: '向公安网安部门报告', priority: 'critical' },
          { item: '向保密部门报告（如涉及涉密信息）', priority: 'critical' },
          { item: '评估数据泄露影响', priority: 'critical' },
          { item: '公民个人信息泄露通知', priority: 'high' },
          { item: '上级主管部门报告', priority: 'critical' }
        ]
      },
      {
        section: '安全整改清单',
        items: [
          { item: '全面排查系统漏洞', priority: 'critical' },
          { item: '升级安全防护设备', priority: 'high' },
          { item: '完善备份机制', priority: 'high' },
          { item: '加强员工安全培训', priority: 'high' },
          { item: '修订安全管理制度', priority: 'medium' },
          { item: '开展等级保护复测', priority: 'high' }
        ]
      }
    ]
  },

  // ==================== 高危漏洞应急处理 ====================
  {
    id: 'zero-day-emergency',
    title: '高危漏洞/零日漏洞应急处理方案',
    category: '高危漏洞',
    severity: 'critical',
    impact: '系统被入侵、数据泄露、权限提升、横向移动',
    affectedSectors: ['所有行业'],
    overview: '当出现高危漏洞（如Apache Log4j、Exchange漏洞、VPN设备漏洞等）被在野利用的紧急情况时，需要快速响应，在攻击者利用漏洞之前完成修复。本方案提供从漏洞发现到修复完成的完整流程。',
    phases: [
      {
        phase: '第一阶段：漏洞确认与评估（0-1小时）',
        duration: '1小时内完成',
        actions: [
          {
            step: 1,
            title: '确认漏洞信息',
            description: '获取漏洞的详细信息，包括CVE编号、影响版本、漏洞类型、已有POC/EXP等。',
            commands: [
              { description: '查询CVE详情', command: 'curl https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-XXXX-XXXX', platform: 'Both' },
              { description: '查询国内漏洞库', command: '访问 opencvdb.org.cn 或 vultop.com', platform: 'Both' },
              { description: '查看厂商公告', command: '访问受影响软件厂商官网', platform: 'Both' }
            ],
            responsible: '安全团队',
            tools: ['NVD', 'CNVD', '厂商官网']
          },
          {
            step: 2,
            title: '评估影响范围',
            description: '清点所有使用受影响组件/软件的系统，评估漏洞利用风险等级。',
            commands: [
              { description: '搜索Log4j应用', command: 'find / -name "log4j*.jar" 2>/dev/null', platform: 'Linux' },
              { description: 'Windows下搜索', command: 'Get-ChildItem -Path C:\\ -Recurse -Filter "log4j*.jar" -ErrorAction SilentlyContinue', platform: 'Windows' },
              { description: '检查应用版本', command: 'java -jar app.jar --version 2>&1 | grep log4j', platform: 'Both' },
              { description: '扫描内网受影响资产', command: 'nmap -p 8080 --script vuln 192.168.1.0/24', platform: 'Linux' }
            ],
            responsible: '安全团队 + 运维团队',
            verification: '形成受影响资产清单'
          },
          {
            step: 3,
            title: '确定漏洞利用紧迫性',
            description: '评估是否存在以下高风险情况：1) POC/EXP已公开；2) 已有在野利用；3) 影响核心业务系统；4) 可被外部直接利用。',
            responsible: '安全专家',
            verification: '确定响应级别（紧急/高危/中危）'
          },
          {
            step: 4,
            title: '启动应急响应',
            description: '对于高危漏洞，立即召集安全会议，部署应急措施。',
            responsible: '安全负责人',
            tools: ['应急响应群', '视频会议系统']
          }
        ]
      },
      {
        phase: '第二阶段：紧急缓解措施（1-4小时）',
        duration: '4小时内完成',
        actions: [
          {
            step: 5,
            title: '实施网络层缓解',
            description: '在网络边界设备上实施临时防护措施，阻止漏洞利用流量。',
            commands: [
              { description: 'WAF添加防护规则（Log4j示例）', command: '在WAF上添加规则阻断 \\${jndi:} 模式', platform: 'Both' },
              { description: 'IPS添加签名', command: '上传厂商提供的IPS规则', platform: 'Both' },
              { description: '临时关闭受影响服务', command: 'systemctl stop apache-log4j', platform: 'Linux' },
              { description: '防火墙临时规则', command: 'iptables -A INPUT -p tcp --dport 8080 -m string --string "jndi" -j DROP', platform: 'Linux' }
            ],
            responsible: '网络管理员 + 安全团队'
          },
          {
            step: 6,
            title: '应用临时补丁/缓解措施',
            description: '如果官方补丁尚未发布，应用厂商建议的临时缓解措施。',
            commands: [
              { description: 'Log4j缓解：设置系统属性', command: 'export LOG4J_FORMAT_MSG_NO_LOOKUPS=true', platform: 'Linux' },
              { description: 'Windows环境变量', command: '[System.Environment]::SetEnvironmentVariable("LOG4J_FORMAT_MSG_NO_LOOKUPS","true","Machine")', platform: 'Windows' },
              { description: '重启应用生效', command: 'systemctl restart your-app.service', platform: 'Linux' },
              { description: '删除JndiLookup类', command: 'zip -q -d log4j-core-*.jar org/apache/logging/log4j/core/lookup/JndiLookup.class', platform: 'Linux' }
            ],
            responsible: '开发团队 + 运维团队',
            verification: '确认缓解措施已生效'
          },
          {
            step: 7,
            title: '加强监控和检测',
            description: '增加对漏洞利用尝试的监控和告警，及时发现可能的攻击。',
            commands: [
              { description: '检查应用日志中的漏洞利用尝试', command: 'grep -E "\\$\\{jndi:|\\$\\{lower:" /var/log/your-app.log', platform: 'Linux' },
              { description: 'SIEM添加告警规则', command: '在SIEM中创建漏洞利用检测规则', platform: 'Both' },
              { description: '主机入侵检测', command: '检查 /proc/*/maps 中是否有可疑so加载', platform: 'Linux' }
            ],
            responsible: '安全运营团队',
            tools: ['SIEM', 'EDR', 'HIDS']
          }
        ]
      },
      {
        phase: '第三阶段：正式修复',
        duration: '根据补丁发布时间',
        actions: [
          {
            step: 8,
            title: '下载和验证官方补丁',
            description: '从官方渠道下载补丁，验证完整性后再部署。',
            commands: [
              { description: '验证补丁签名', command: 'gpg --verify patch.sig patch.tar.gz', platform: 'Linux' },
              { description: '计算补丁哈希', command: 'sha256sum patch.tar.gz', platform: 'Both' },
              { description: '对比官方发布的哈希', command: '访问厂商官网核对', platform: 'Both' }
            ],
            responsible: '运维团队',
            verification: '补丁哈希验证通过'
          },
          {
            step: 9,
            title: '测试环境验证',
            description: '在测试环境中验证补丁不影响业务功能。',
            responsible: '测试团队 + 开发团队',
            tools: ['测试环境', '自动化测试脚本']
          },
          {
            step: 10,
            title: '生产环境部署',
            description: '分批次在生产环境部署补丁，优先处理高风险系统。',
            commands: [
              { description: '备份当前版本', command: 'tar -czf backup_$(date +%Y%m%d).tar.gz /opt/app', platform: 'Linux' },
              { description: '停止服务', command: 'systemctl stop your-app', platform: 'Linux' },
              { description: '应用补丁', command: 'tar -xzf patch.tar.gz -C /opt/app', platform: 'Linux' },
              { description: '启动服务', command: 'systemctl start your-app', platform: 'Linux' },
              { description: '验证运行状态', command: 'systemctl status your-app && curl -I http://localhost:8080/health', platform: 'Linux' }
            ],
            responsible: '运维团队',
            verification: '服务正常运行'
          }
        ]
      }
    ],
    checklists: [
      {
        section: 'Log4j漏洞专项检查清单',
        items: [
          { item: '搜索所有log4j*.jar文件', priority: 'critical' },
          { item: '确认log4j版本（是否<2.17.0）', priority: 'critical' },
          { item: '检查Java进程启动参数', priority: 'high' },
          { item: '检查环境变量设置', priority: 'high' },
          { item: '应用临时缓解措施', priority: 'critical' },
          { item: '部署官方补丁', priority: 'critical' },
          { item: '检查日志中的利用尝试', priority: 'high' }
        ]
      },
      {
        section: '漏洞修复后验证清单',
        items: [
          { item: '验证补丁版本正确', priority: 'critical' },
          { item: '验证服务功能正常', priority: 'critical' },
          { item: '验证缓解措施仍有效', priority: 'high' },
          { item: '检查相关日志无异常', priority: 'high' },
          { item: '更新资产清单和漏洞台账', priority: 'medium' }
        ]
      }
    ],
    scripts: [
      {
        name: 'Log4j快速检测脚本',
        description: '检测系统中的Log4j漏洞',
        language: 'Bash',
        platform: 'Linux',
        content: "#!/bin/bash\n# Log4j漏洞快速检测脚本\n# 保存为: check_log4j.sh\n\necho \"=== Log4j漏洞检测开始 ===\"\necho \"检测时间: $(date)\"\necho \"\"\n\n# 搜索log4j文件\necho \"[1] 搜索log4j-core文件...\"\nfind / -name \"log4j-core*.jar\" 2>/dev/null | while read f; do\n    echo \"找到: $f\"\n    # 检查版本\n    unzip -p \"$f\" META-INF/MANIFEST.MF 2>/dev/null | grep Bundle-Version\ndone\n\n# 检查Java进程\necho \"\"\necho \"[2] 检查运行的Java进程...\"\nps aux | grep java | grep -v grep | awk '{print $2}' | while read pid; do\n    echo \"进程PID: $pid\"\n    cat /proc/$pid/environ 2>/dev/null | tr '\\0' '\\n' | grep -i log4j\ndone\n\n# 检查环境变量\necho \"\"\necho \"[3] 检查LOG4J相关环境变量...\"\nenv | grep -i log4j\n\n# 检查系统属性\necho \"\"\necho \"[4] 检查Log4j系统属性配置...\"\nif [ -f /etc/sysconfig/your-app ]; then\n    grep -i log4j /etc/sysconfig/your-app\nfi\n\necho \"\"\necho \"=== 检测完成 ===\""
      }
    ]
  },

  // ==================== 打补丁导致系统崩溃处理 ====================
  {
    id: 'patching-failure',
    title: '打补丁导致系统崩溃应急处理方案',
    category: '补丁管理',
    severity: 'high',
    impact: '系统无法启动、业务中断、数据丢失风险',
    affectedSectors: ['所有行业', '特别影响医院、工厂等24小时运行系统'],
    overview: '安全补丁可能与现有系统不兼容，导致打补丁后系统无法启动、服务异常甚至数据损坏。本方案针对这一情况提供快速恢复和后续处理流程，特别针对不能中断业务的连续性系统。',
    phases: [
      {
        phase: '第一阶段：紧急响应（0-30分钟）',
        duration: '30分钟内完成',
        actions: [
          {
            step: 1,
            title: '确认系统状态',
            description: '判断系统崩溃程度：完全无法启动、系统蓝屏/黑屏、服务无法启动、运行异常缓慢。',
            commands: [
              { description: '检查系统启动日志', command: 'journalctl -b -1 | tail -50', platform: 'Linux' },
              { description: '检查Windows蓝屏转储', command: 'Get-ChildItem C:\\Windows\\Minidump\\*.dmp | Sort-Object LastWriteTime -Descending | Select-Object -First 1', platform: 'Windows' },
              { description: '查看系统事件日志', command: 'wevtutil qe System /c:20 /f:text /q:"*[System[(EventID=1000)]]"', platform: 'Windows' }
            ],
            responsible: '系统管理员',
            tools: ['PE启动盘', '系统救援盘']
          },
          {
            step: 2,
            title: '启动回退预案',
            description: '如果之前创建了系统快照或备份，立即执行回退操作。',
            commands: [
              { description: 'VMware虚拟机快照回退', command: 'vim-cmd vmsvc/snapshot.revert 虚拟机ID 快照ID', platform: 'Linux' },
              { description: 'Hyper-V检查还原点', command: 'Get-VMSnapshot -VMName "YourVM"', platform: 'Windows' },
              { description: '执行Hyper-V还原', command: 'Restore-VMSnapshot -VMName "YourVM" -SnapshotName "补丁前快照" -Confirm:$false', platform: 'Windows' }
            ],
            responsible: '运维团队',
            verification: '系统已回退到补丁前状态'
          },
          {
            step: 3,
            title: '启动备用系统',
            description: '如果有备用服务器或灾备系统，立即启动以维持业务连续性。',
            responsible: '运维团队 + 业务部门',
            tools: ['备用服务器', '灾备系统']
          },
          {
            step: 4,
            title: '切换到应急操作模式',
            description: '在系统恢复前，启用应急操作预案，使用手工或备用方式维持基本业务。',
            responsible: '业务部门负责人'
          }
        ]
      },
      {
        phase: '第二阶段：故障分析（30分钟-2小时）',
        duration: '1.5小时内完成',
        actions: [
          {
            step: 5,
            title: '收集故障证据',
            description: '收集补丁失败的相关信息，包括补丁KB号、错误日志、系统日志等。',
            commands: [
              { description: '查看Windows Update日志', command: 'Get-Content C:\\Windows\\WindowsUpdate.log -Tail 100', platform: 'Windows' },
              { description: '查看SetupErr.log', command: 'Get-Content "C:\\$Windows.~BT\\Sources\\Panther\\setupact.log" -ErrorAction SilentlyContinue', platform: 'Windows' },
              { description: '查看安装失败事件', command: 'wevtutil qe Setup /c:50 /f:text | findstr /i "failed error kb"', platform: 'Windows' },
              { description: 'Linux下查看更新日志', command: 'cat /var/log/dnf.log | tail -100', platform: 'Linux' }
            ],
            responsible: '系统管理员'
          },
          {
            step: 6,
            title: '确认不兼容原因',
            description: '分析补丁与系统不兼容的具体原因：1) 系统版本不匹配；2) 缺少前置补丁；3) 驱动不兼容；4) 应用软件冲突；5) 硬件不兼容。',
            commands: [
              { description: '检查已安装的补丁', command: 'systeminfo | findstr KB', platform: 'Windows' },
              { description: '检查系统版本', command: 'winver', platform: 'Windows' },
              { description: '检查驱动版本', command: 'driverquery /v | findstr "File version"', platform: 'Windows' },
              { description: 'CentOS检查已安装内核', command: 'rpm -qa | grep kernel', platform: 'Linux' }
            ],
            responsible: '系统管理员 + 供应商'
          },
          {
            step: 7,
            title: '联系补丁厂商/供应商',
            description: '将故障信息上报给微软或软件供应商，询问解决方案和替代方案。',
            responsible: 'IT主管',
            tools: ['供应商支持合同', '补丁KB号信息']
          }
        ]
      },
      {
        phase: '第三阶段：修复与恢复',
        duration: '根据情况',
        actions: [
          {
            step: 8,
            title: '卸载问题补丁',
            description: '如果系统还能启动，尝试卸载导致问题的补丁。',
            commands: [
              { description: '卸载指定补丁（Windows）', command: 'wusa /uninstall /kb:KB号 /quiet /norestart', platform: 'Windows' },
              { description: '卸载指定补丁（带确认）', command: 'wusa /uninstall /kb:KB号', platform: 'Windows' },
              { description: 'Ubuntu回退更新', command: 'sudo apt-get remove --purge 更新包名 && sudo apt-get autoremove', platform: 'Linux' },
              { description: 'CentOS回退更新', command: 'sudo yum rollback 更新包名', platform: 'Linux' }
            ],
            responsible: '系统管理员',
            verification: '补丁已卸载，系统稳定'
          },
          {
            step: 9,
            title: '等待修复补丁',
            description: '如果微软已知问题并发布修复补丁，等待修复补丁发布后重新测试。',
            responsible: 'IT团队',
            verification: '在测试环境验证修复补丁'
          },
          {
            step: 10,
            title: '实施缓解措施',
            description: '如果漏洞风险仍然存在，实施临时缓解措施代替打补丁。',
            commands: [
              { description: '网络层阻止漏洞利用', command: '在防火墙上添加规则', platform: 'Both' },
              { description: '启用应用层防护', command: '配置WAF规则', platform: 'Both' },
              { description: '加强监控', command: '增加对漏洞利用的监控', platform: 'Both' }
            ],
            responsible: '安全团队'
          },
          {
            step: 11,
            title: '更新补丁管理流程',
            description: '根据此次事件，更新补丁管理流程，增加测试环节，避免类似事件再次发生。',
            responsible: 'IT主管',
            tools: ['补丁管理流程文档']
          }
        ]
      }
    ],
    checklists: [
      {
        section: '医院系统打补丁特殊检查清单',
        items: [
          { item: '提前通知医务科和护理部', priority: 'critical' },
          { item: '确保备用系统在备用机房运行正常', priority: 'critical' },
          { item: '准备好手工操作预案', priority: 'high' },
          { item: '安排IT人员现场值守', priority: 'high' },
          { item: '通知患者可能的服务延迟', priority: 'high' },
          { item: '评估是否需要暂停非紧急业务', priority: 'medium' }
        ]
      },
      {
        section: '补丁测试验证清单',
        items: [
          { item: '在测试环境完整验证', priority: 'critical' },
          { item: '测试所有关键业务功能', priority: 'critical' },
          { item: '测试与第三方系统对接', priority: 'high' },
          { item: '测试外设连接（打印机、扫描仪等）', priority: 'high' },
          { item: '测试备份和恢复流程', priority: 'high' },
          { item: '记录测试结果和任何异常', priority: 'high' },
          { item: '获得业务部门确认', priority: 'critical' }
        ]
      }
    ],
    scripts: [
      {
        name: '补丁回退脚本',
        description: 'Windows补丁快速回退脚本',
        language: 'PowerShell',
        platform: 'Windows',
        content: "# Windows补丁回退脚本\n# 保存为: Uninstall-Patch.ps1\n# 需要管理员权限\n\nparam(\n    [Parameter(Mandatory=$true)]\n    [string]$KBNumber\n)\n\nif (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {\n    Write-Host \"需要管理员权限!\" -ForegroundColor Red\n    exit 1\n}\n\nWrite-Host \"=== 开始卸载补丁 KB$KBNumber ===\" -ForegroundColor Yellow\n\n# 确认补丁存在\n$patch = Get-HotFix | Where-Object { $_.HotFixID -eq \"KB$KBNumber\" }\nif (-not $patch) {\n    Write-Host \"未找到补丁 KB$KBNumber\" -ForegroundColor Red\n    exit 1\n}\n\nWrite-Host \"找到补丁: $($patch.Description) - $($patch.InstalledOn)\" -ForegroundColor Cyan\n\n# 创建系统还原点（如果系统保护开启）\nWrite-Host \"`n正在创建系统还原点...\" -ForegroundColor Yellow\ntry {\n    Checkpoint-Computer -Description \"BeforeUninstall-KB$KBNumber\" -RestorePointType \"MODIFY_SETTINGS\"\n    Write-Host \"[OK] 还原点创建成功\" -ForegroundColor Green\n} catch {\n    Write-Host \"[警告] 无法创建还原点: $_\" -ForegroundColor Yellow\n}\n\n# 备份当前补丁列表\n$patchList = Get-HotFix | Select-Object HotFixID, Description, InstalledOn\n$patchList | Export-Csv -Path \"C:\\HotfixBackup_$(Get-Date -Format yyyyMMdd).csv\" -NoTypeInformation\nWrite-Host \"[OK] 补丁列表已备份\" -ForegroundColor Green\n\n# 卸载补丁\nWrite-Host \"`n正在卸载补丁...\" -ForegroundColor Yellow\ntry {\n    Write-Host \"计算机将重启，请保存所有工作...\" -ForegroundColor Yellow\n    Start-Process -FilePath \"wusa.exe\" -ArgumentList \"/uninstall /kb:$KBNumber /quiet /norestart\" -Wait -NoNewWindow\n    Write-Host \"`n卸载命令已执行\" -ForegroundColor Green\n    Write-Host \"请手动重启计算机使更改生效\" -ForegroundColor Yellow\n} catch {\n    Write-Host \"[错误] 卸载失败: $_\" -ForegroundColor Red\n}\n\nWrite-Host \"`n=== 脚本执行完成 ===\" -ForegroundColor Yellow"
      }
    ]
  },

  // ==================== 数据泄露应急处理 ====================
  {
    id: 'data-breach',
    title: '数据泄露安全事件应急处理方案',
    category: '数据泄露',
    severity: 'critical',
    impact: '敏感信息泄露、法规处罚、客户信任丧失',
    affectedSectors: ['所有行业', '特别涉及个人信息、企业机密'],
    overview: '数据泄露可能来自外部攻击、内部人员窃取或意外泄露。一旦发生数据泄露，需要快速响应以控制损失、满足合规要求、恢复客户信任。本方案涵盖从发现泄露到恢复的完整流程。',
    phases: [
      {
        phase: '第一阶段：发现与确认（0-1小时）',
        duration: '1小时内完成',
        actions: [
          {
            step: 1,
            title: '确认数据泄露事件',
            description: '判断是否真的发生了数据泄露，排除误报。泄露迹象包括：异常数据访问、数据库异常、文件被下载、收到勒索威胁等。',
            commands: [
              { description: '检查数据库登录日志', command: 'SELECT * FROM logs WHERE action=\'SELECT\' AND rows > 10000 ORDER BY timestamp DESC', platform: 'Both' },
              { description: '检查大批量数据导出', command: 'Get-WinEvent -LogName Security | Where-Object { $_.Message -match "Export|Dump|Backup" }', platform: 'Windows' },
              { description: '检查可疑的文件访问', command: 'auditpol /get /category:"Object Access" | Select-String "File System"', platform: 'Windows' },
              { description: '检查数据外发邮件', command: '搜索邮件网关日志中的大附件外发', platform: 'Both' }
            ],
            responsible: '安全团队 + DBA',
            tools: ['数据库审计日志', 'SIEM', '邮件网关日志']
          },
          {
            step: 2,
            title: '评估泄露范围',
            description: '确定泄露的数据类型、数量、受影响用户范围。',
            commands: [
              { description: '统计泄露表的数据量', command: 'SELECT COUNT(*) FROM users WHERE compromised=true', platform: 'Both' },
              { description: '查看数据变更日志', command: 'SELECT * FROM audit_log WHERE table_name=\'sensitive_data\' AND action=\'DELETE\'', platform: 'Both' },
              { description: '分析数据泄露途径', command: '检查防火墙日志中的可疑出站连接', platform: 'Both' }
            ],
            responsible: '安全团队 + 法务',
            verification: '形成泄露范围评估报告'
          },
          {
            step: 3,
            title: '启动应急响应团队',
            description: '召集应急响应团队，包括安全、法务、公关、高管。',
            responsible: '应急响应负责人',
            tools: ['应急联系人表', '会议室/视频会议']
          },
          {
            step: 4,
            title: '初步上报',
            description: '根据法规要求，向相关监管部门进行初步上报。',
            responsible: '法务 + 合规部门',
            tools: ['监管机构联系方式', '报告模板']
          }
        ]
      },
      {
        phase: '第二阶段：遏制与调查（1-24小时）',
        duration: '24小时内完成',
        actions: [
          {
            step: 5,
            title: '切断泄露途径',
            description: '关闭导致数据泄露的漏洞或账户，防止进一步泄露。',
            commands: [
              { description: '禁用可疑账户', command: 'net user suspicious_user /active:no', platform: 'Windows' },
              { description: '重置所有密码', command: 'ALTER USER ALL WITH PASSWORD = NEW_PASSWORD()', platform: 'Both' },
              { description: '关闭有漏洞的应用接口', command: 'nginx -s stop（临时关闭受影响API）', platform: 'Linux' },
              { description: '撤销泄露的API密钥', command: '在API管理平台撤销所有密钥', platform: 'Both' }
            ],
            responsible: '安全团队 + 运维',
            verification: '泄露途径已切断'
          },
          {
            step: 6,
            title: '收集证据',
            description: '收集泄露相关的证据，包括日志、流量数据、系统镜像等。',
            commands: [
              { description: '导出数据库审计日志', command: 'SELECT * FROM audit_log WHERE timestamp > 开始时间 INTO OUTFILE', platform: 'Both' },
              { description: '抓取相关时间段流量', command: '保存防火墙PCAP文件', platform: 'Both' },
              { description: '创建数据库镜像', command: 'mysqldump --single-transaction --master-data=2 database > backup.sql', platform: 'Linux' }
            ],
            responsible: '取证团队',
            tools: ['FTK Imager', 'tcpdump', '数据库工具']
          },
          {
            step: 7,
            title: '确定泄露原因',
            description: '分析是外部攻击、内部窃取还是意外泄露。',
            commands: [
              { description: '分析攻击痕迹', command: '使用取证工具分析入侵路径', platform: 'Both' },
              { description: '检查是否有内部违规', command: '检查员工访问日志和数据下载记录', platform: 'Both' },
              { description: '检查第三方供应商', command: '审查供应商数据访问记录', platform: 'Both' }
            ],
            responsible: '安全专家 + 法务'
          },
          {
            step: 8,
            title: '法务评估',
            description: '评估数据泄露的法规影响，确定通知义务。',
            responsible: '法务部门',
            tools: ['数据保护法规', '处罚标准']
          }
        ]
      },
      {
        phase: '第三阶段：通知与恢复',
        duration: '数天到数周',
        actions: [
          {
            step: 9,
            title: '向监管部门报告',
            description: '根据《个人信息保护法》等法规，在规定时间内向监管部门报告。个人信息泄露：72小时内向网信部门报告；重要数据泄露：向网信部门报告。',
            responsible: '法务 + 合规',
            tools: ['监管报告模板', '证据材料']
          },
          {
            step: 10,
            title: '通知受影响用户',
            description: '根据法规要求，通知受影响的个人用户，说明泄露情况、可能影响和补救措施。',
            responsible: '公关 + 法务',
            tools: ['用户通知模板', '邮件/短信发送系统']
          },
          {
            step: 11,
            title: '修复漏洞和安全加固',
            description: '修复导致泄露的安全漏洞，加强安全防护。',
            commands: [
              { description: '修复SQL注入漏洞', command: '代码审计 + 修复', platform: 'Both' },
              { description: '加强认证机制', command: '启用MFA', platform: 'Both' },
              { description: '部署数据防泄漏系统', command: 'DLP系统部署', platform: 'Both' }
            ],
            responsible: '安全团队 + 开发团队'
          },
          {
            step: 12,
            title: '事后复盘和改进',
            description: '全面复盘事件，改进安全措施，更新应急预案。',
            responsible: '安全负责人 + 高管',
            tools: ['复盘报告模板', '改进计划表']
          }
        ]
      }
    ],
    checklists: [
      {
        section: '数据泄露合规通知清单',
        items: [
          { item: '向国家网信部门报告（72小时内）', priority: 'critical' },
          { item: '向省级网信部门报告', priority: 'high' },
          { item: '向公安机关报告（如涉及犯罪）', priority: 'high' },
          { item: '通知受影响用户（尽快）', priority: 'critical' },
          { item: '通知合作伙伴（如涉及）', priority: 'high' },
          { item: '通知保险公司（如有网络安全险）', priority: 'medium' },
          { item: '准备公关声明', priority: 'high' }
        ]
      },
      {
        section: '数据泄露修复清单',
        items: [
          { item: '关闭泄露漏洞', priority: 'critical' },
          { item: '重置所有相关账户密码', priority: 'critical' },
          { item: '撤销所有API密钥和token', priority: 'high' },
          { item: '启用更强认证机制', priority: 'high' },
          { item: '部署DLP系统', priority: 'high' },
          { item: '更新安全策略和流程', priority: 'medium' }
        ]
      }
    ]
  },

  // ==================== 供应链攻击应急处理 ====================
  {
    id: 'supply-chain-attack',
    title: '供应链攻击安全事件应急处理方案',
    category: '供应链安全',
    severity: 'critical',
    impact: '大规模系统入侵、恶意软件传播、信任危机',
    affectedSectors: ['所有行业', '软件开发商、集成商'],
    overview: '供应链攻击通过入侵软件供应商、第三方服务提供商等，间接攻击目标组织。一旦发现供应链被入侵，需要快速响应以控制影响范围。常见场景包括：第三方运维被入侵、软件开发环境被污染、供应商数据泄露等。',
    phases: [
      {
        phase: '第一阶段：发现与确认（0-2小时）',
        duration: '2小时内完成',
        actions: [
          {
            step: 1,
            title: '确认供应链攻击事件',
            description: '确认是否受到供应链攻击的影响。迹象包括：安全厂商发布供应链攻击预警、供应商通知、异常的系统行为、恶意软件检测等。',
            commands: [
              { description: '检查供应商公告', command: '查看微软、Adobe等厂商的安全公告', platform: 'Both' },
              { description: '搜索IOC指标', command: '在威胁情报平台搜索已知IOC', platform: 'Both' },
              { description: '检查系统完整性', command: 'sha256sum -c filehashes.txt', platform: 'Linux' },
              { description: '检查启动项', command: 'Autoruns.exe | findstr /i "third party vendor"', platform: 'Windows' }
            ],
            responsible: '安全团队',
            tools: ['威胁情报平台', '文件完整性检测工具']
          },
          {
            step: 2,
            title: '评估受影响范围',
            description: '确定哪些系统使用了受影响的供应商产品或服务。',
            commands: [
              { description: '清点供应商软件', command: 'Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select DisplayName, Publisher', platform: 'Windows' },
              { description: '检查远程运维工具', command: 'tasklist | findstr /i "teamviewer anydesk vnc"', platform: 'Windows' },
              { description: '检查第三方SDK', command: 'find . -name "package.json" -exec grep -l "suspicious-package"', platform: 'Linux' }
            ],
            responsible: '安全团队 + 运维',
            verification: '形成受影响资产清单'
          },
          {
            step: 3,
            title: '切断与供应商的连接',
            description: '临时断开与受影响供应商的网络连接，防止攻击扩散。',
            commands: [
              { description: '禁用供应商VPN', command: '关闭供应商远程访问通道', platform: 'Both' },
              { description: '阻断供应商IP段', command: 'iptables -A INPUT -s 供应商IP段 -j DROP', platform: 'Linux' },
              { description: '关闭供应商服务', command: 'systemctl stop vendor-service', platform: 'Linux' }
            ],
            responsible: '网络管理员',
            verification: '供应商连接已断开'
          }
        ]
      },
      {
        phase: '第二阶段：排查与清理（2-24小时）',
        duration: '24小时内完成',
        actions: [
          {
            step: 4,
            title: '全面排查系统',
            description: '使用IOC指标和YARA规则对所有系统进行全面排查。',
            commands: [
              { description: '扫描恶意软件', command: 'clamscan -r / --infected --log=/var/log/clamscan.log', platform: 'Linux' },
              { description: '运行YARA规则', command: 'yarac -r rules.yar /path/to/scan', platform: 'Linux' },
              { description: '检查计划任务', command: 'crontab -l; cat /etc/crontab', platform: 'Linux' },
              { description: '检查服务', command: 'systemctl list-units --type=service --state=running', platform: 'Linux' },
              { description: 'Windows检查服务', command: 'Get-Service | Where-Object { $_.StartType -eq "Automatic" }', platform: 'Windows' }
            ],
            responsible: '安全团队',
            tools: ['ClamAV', 'YARA', 'EDR', 'SIEM']
          },
          {
            step: 5,
            title: '重置供应商相关的凭据',
            description: '重置所有通过该供应商管理的账户和密钥。',
            commands: [
              { description: '重置供应商管理账户', command: 'net user vendor_admin /active:no', platform: 'Windows' },
              { description: '轮换API密钥', command: '在所有系统中轮换该供应商的API密钥', platform: 'Both' },
              { description: '更新VPN凭据', command: '更新VPN预共享密钥', platform: 'Both' }
            ],
            responsible: '安全团队 + 运维'
          },
          {
            step: 6,
            title: '更新供应商软件',
            description: '安装供应商发布的安全更新或补丁。',
            commands: [
              { description: '更新供应商软件', command: 'sudo apt update && sudo apt upgrade vendor-package', platform: 'Linux' },
              { description: 'Windows更新', command: 'wusa /install /kb:供应商KB号 /quiet /norestart', platform: 'Windows' }
            ],
            responsible: '运维团队'
          }
        ]
      },
      {
        phase: '第三阶段：恢复与改进',
        duration: '数天',
        actions: [
          {
            step: 7,
            title: '评估供应商安全性',
            description: '重新评估该供应商的安全能力，考虑是否继续合作。',
            responsible: '采购部门 + 安全团队',
            tools: ['供应商安全评估表']
          },
          {
            step: 8,
            title: '加强供应商安全管理',
            description: '更新供应商安全要求，增加监控和审计措施。',
            responsible: '安全团队 + 采购部门',
            tools: ['供应商安全管理流程']
          },
          {
            step: 9,
            title: '完善应急响应预案',
            description: '将供应链攻击纳入应急响应预案，定期演练。',
            responsible: '安全负责人'
          }
        ]
      }
    ],
    checklists: [
      {
        section: '供应商安全评估清单',
        items: [
          { item: '评估供应商安全资质', priority: 'high' },
          { item: '检查供应商安全认证（ISO27001等）', priority: 'high' },
          { item: '审查供应商安全流程', priority: 'high' },
          { item: '评估供应商访问权限', priority: 'critical' },
          { item: '建立供应商安全事件响应机制', priority: 'high' }
        ]
      },
      {
        section: '供应链安全改进清单',
        items: [
          { item: '实施最小权限原则', priority: 'critical' },
          { item: '增加供应商访问监控', priority: 'high' },
          { item: '定期安全审计', priority: 'high' },
          { item: '建立供应商备份方案', priority: 'medium' },
          { item: '制定供应商退出计划', priority: 'medium' }
        ]
      }
    ]
  },

  // ==================== DDoS攻击应急处理 ====================
  {
    id: 'ddos-attack',
    title: 'DDoS攻击安全事件应急处理方案',
    category: 'DDoS攻击',
    severity: 'high',
    impact: '服务不可用、业务中断、用户流失',
    affectedSectors: ['所有行业', '网站、游戏、金融'],
    overview: '分布式拒绝服务（DDoS）攻击通过大量请求耗尽目标系统资源，导致正常用户无法访问服务。本方案提供从检测到恢复的完整处理流程。',
    phases: [
      {
        phase: '第一阶段：确认与初期响应（0-30分钟）',
        duration: '30分钟内完成',
        actions: [
          {
            step: 1,
            title: '确认DDoS攻击',
            description: '判断是否遭受DDoS攻击，排除正常流量高峰。',
            commands: [
              { description: '检查带宽使用', command: 'iftop -i eth0 或 nload', platform: 'Linux' },
              { description: '检查连接数', command: 'netstat -an | grep ESTABLISHED | wc -l', platform: 'Linux' },
              { description: '检查防火墙日志', command: 'tail -f /var/log/iptables.log', platform: 'Linux' },
              { description: 'Windows网络统计', command: 'netstat -e -s', platform: 'Windows' }
            ],
            responsible: '运维团队',
            tools: ['iftop', 'nload', '防火墙日志']
          },
          {
            step: 2,
            title: '启用云防护服务',
            description: '如果使用了云DDoS防护服务，立即启用清洗。',
            commands: [
              { description: '阿里云DDoS防护', command: '在DDoS防护控制台启用流量清洗', platform: 'Both' },
              { description: 'Cloudflare', command: "在Cloudflare设置中开启I'm Under Attack模式", platform: 'Both' },
              { description: 'AWS Shield', command: '确认AWS Shield已启用', platform: 'Both' }
            ],
            responsible: '运维团队',
            tools: ['云防护控制台']
          },
          {
            step: 3,
            title: '联系ISP/服务商',
            description: '通知网络服务商，请求协助进行流量清洗或黑洞路由。',
            responsible: '网络管理员',
            tools: ['服务商联系方式']
          }
        ]
      },
      {
        phase: '第二阶段：缓解与处置（30分钟-2小时）',
        duration: '1.5小时内完成',
        actions: [
          {
            step: 4,
            title: '配置防火墙规则',
            description: '临时限制非必要流量，阻断明显的攻击流量。',
            commands: [
              { description: '限制连接速率', command: 'iptables -A INPUT -p tcp --dport 80 -m limit --limit 100/minute -j ACCEPT', platform: 'Linux' },
              { description: '封锁可疑IP', command: 'iptables -A INPUT -s 可疑IP -j DROP', platform: 'Linux' },
              { description: 'Windows防火墙', command: 'New-NetFirewallRule -DisplayName "Block Attack IPs" -RemoteAddress 可疑IP段', platform: 'Windows' },
              { description: '使用fail2ban自动封锁', command: 'systemctl start fail2ban', platform: 'Linux' }
            ],
            responsible: '网络管理员'
          },
          {
            step: 5,
            title: '启用CDN缓存',
            description: '尽可能将静态内容通过CDN提供，减少源站压力。',
            commands: [
              { description: '刷新CDN缓存', command: '在CDN控制台执行缓存刷新', platform: 'Both' },
              { description: '增加缓存时间', command: '设置Cache-Control: max-age=86400', platform: 'Both' }
            ],
            responsible: '运维团队'
          },
          {
            step: 6,
            title: '扩容应对',
            description: '临时增加带宽或服务器资源应对攻击。',
            commands: [
              { description: '临时增加带宽', command: '联系云服务商临时扩容', platform: 'Both' },
              { description: '增加服务器', command: '云控制台增加实例', platform: 'Both' },
              { description: '负载均衡扩容', command: '增加负载均衡后端', platform: 'Both' }
            ],
            responsible: '运维团队'
          }
        ]
      },
      {
        phase: '第三阶段：恢复与总结',
        duration: '攻击结束后',
        actions: [
          {
            step: 7,
            title: '恢复正常服务',
            description: '攻击平息后，逐步恢复正常服务。',
            commands: [
              { description: '解除临时封锁规则', command: '移除临时添加的iptables规则', platform: 'Linux' },
              { description: '恢复正常带宽', command: '调整带宽到正常水平', platform: 'Both' }
            ],
            responsible: '运维团队'
          },
          {
            step: 8,
            title: '分析与改进',
            description: '分析攻击特征，完善防护措施。',
            commands: [
              { description: '分析攻击日志', command: '生成攻击报告', platform: 'Both' },
              { description: '评估防护效果', command: '检查防火墙和CDN日志', platform: 'Both' }
            ],
            responsible: '安全团队',
            tools: ['日志分析工具']
          }
        ]
      }
    ],
    checklists: [
      {
        section: 'DDoS应急响应清单',
        items: [
          { item: '确认DDoS攻击', priority: 'critical' },
          { item: '启用云防护服务', priority: 'critical' },
          { item: '联系ISP协助', priority: 'high' },
          { item: '配置防护规则', priority: 'high' },
          { item: '启用CDN缓存', priority: 'high' },
          { item: '扩容应对', priority: 'medium' },
          { item: '通知用户', priority: 'high' },
          { item: '事后分析与改进', priority: 'medium' }
        ]
      }
    ]
  },

  // ==================== 内部人员安全事件应急处理 ====================
  {
    id: 'insider-threat',
    title: '内部人员安全事件应急处理方案',
    category: '内部威胁',
    severity: 'high',
    impact: '数据泄露、系统破坏、信任危机',
    affectedSectors: ['所有行业'],
    overview: '内部人员安全事件指由员工、承包商、供应商等内部人员有意或无意造成的安全事件。本方案针对恶意内部威胁和无意失误两种情况提供处理流程，强调证据收集和依法处理。',
    phases: [
      {
        phase: '第一阶段：发现与确认（0-2小时）',
        duration: '2小时内完成',
        actions: [
          {
            step: 1,
            title: '确认内部安全事件',
            description: '判断是否发生内部人员安全事件。迹象包括：异常的数据访问、敏感文件外发、特权账户滥用、员工举报等。',
            commands: [
              { description: '检查数据外发记录', command: '查看邮件网关、DLP日志中的敏感数据外发', platform: 'Both' },
              { description: '检查文件访问日志', command: '审计文件服务器日志', platform: 'Both' },
              { description: '检查特权账户活动', command: '查看域管理员日志', platform: 'Windows' },
              { description: '检查USB使用', command: '查看USB使用记录', platform: 'Both' }
            ],
            responsible: '安全团队 + HR',
            tools: ['DLP', 'SIEM', '文件审计日志']
          },
          {
            step: 2,
            title: '保护证据',
            description: '在采取任何行动前，确保相关证据被妥善保存。',
            commands: [
              { description: '导出邮件日志', command: '导出可疑员工的所有邮件日志', platform: 'Both' },
              { description: '导出文件操作日志', command: '导出相关时间段的文件操作记录', platform: 'Both' },
              { description: '创建屏幕录像', command: '如有屏幕监控，保存相关录像', platform: 'Both' }
            ],
            responsible: '取证人员',
            tools: ['取证工具', '邮件归档系统']
          },
          {
            step: 3,
            title: '评估事件严重程度',
            description: '初步评估泄露或破坏的范围和影响。',
            responsible: '安全团队 + HR + 法务'
          }
        ]
      },
      {
        phase: '第二阶段：响应与处置',
        duration: '根据情况',
        actions: [
          {
            step: 4,
            title: '暂停涉事人员访问权限',
            description: '临时冻结涉事人员的账户和相关权限。',
            commands: [
              { description: '禁用AD账户', command: 'net user employee_id /active:no', platform: 'Windows' },
              { description: '禁用门禁卡', command: '在门禁系统中禁用该员工卡片', platform: 'Both' },
              { description: '远程锁定设备', command: '如果是笔记本，远程锁定', platform: 'Both' },
              { description: '保留邮箱但限制访问', command: '设置邮箱只进不出规则', platform: 'Both' }
            ],
            responsible: 'IT运维 + HR'
          },
          {
            step: 5,
            title: 'HR和法务介入',
            description: 'HR和法务部门按照公司政策和法律规定处理。',
            responsible: 'HR + 法务',
            tools: ['员工手册', '劳动合同', '法务指南']
          },
          {
            step: 6,
            title: '数据泄露控制',
            description: '如果数据已被泄露，采取措施控制进一步泄露。',
            commands: [
              { description: '如果是网盘泄露', command: '删除已泄露文件，请求云服务商协助', platform: 'Both' },
              { description: '如果是邮件泄露', command: '请求接收方删除，保留发送记录作为证据', platform: 'Both' }
            ],
            responsible: '安全团队 + 法务'
          },
          {
            step: 7,
            title: '评估是否需要报警',
            description: '如果涉及严重违法行为，评估是否需要报警。',
            responsible: '法务 + HR + 高管'
          }
        ]
      },
      {
        phase: '第三阶段：改进与预防',
        duration: '事件结束后',
        actions: [
          {
            step: 8,
            title: '完善权限管理',
            description: '根据事件教训，调整权限分配策略。',
            commands: [
              { description: '审查权限分配', command: '检查是否存在权限过大问题', platform: 'Both' },
              { description: '实施最小权限', command: '按照最小权限原则重新分配', platform: 'Both' }
            ],
            responsible: '安全团队 + 业务部门'
          },
          {
            step: 9,
            title: '加强监控措施',
            description: '增加对敏感数据的监控和告警。',
            commands: [
              { description: '加强DLP规则', command: '更新数据防泄漏策略', platform: 'Both' },
              { description: '增加审计日志', command: '扩大审计范围', platform: 'Both' }
            ],
            responsible: '安全团队'
          }
        ]
      }
    ],
    checklists: [
      {
        section: '内部事件处理特殊清单',
        items: [
          { item: '确保HR和法务参与', priority: 'critical' },
          { item: '妥善保存所有证据', priority: 'critical' },
          { item: '避免打草惊蛇', priority: 'high' },
          { item: '确保处理合法合规', priority: 'critical' },
          { item: '做好员工安抚工作', priority: 'medium' },
          { item: '内部通报范围控制', priority: 'high' }
        ]
      }
    ]
  }
];

// 应急场景分类统计
export const emergencyCategories = [
  {
    name: '勒索病毒',
    description: '勒索病毒攻击应急处理方案',
    count: emergencyScenarios.filter(s => s.category === '勒索病毒').length,
    severity: 'critical'
  },
  {
    name: '高危漏洞',
    description: '高危漏洞/零日漏洞应急处理',
    count: emergencyScenarios.filter(s => s.category === '高危漏洞').length,
    severity: 'critical'
  },
  {
    name: '补丁管理',
    description: '打补丁导致系统崩溃处理',
    count: emergencyScenarios.filter(s => s.category === '补丁管理').length,
    severity: 'high'
  },
  {
    name: '数据泄露',
    description: '数据泄露安全事件处理',
    count: emergencyScenarios.filter(s => s.category === '数据泄露').length,
    severity: 'critical'
  },
  {
    name: '供应链安全',
    description: '供应链攻击应急处理',
    count: emergencyScenarios.filter(s => s.category === '供应链安全').length,
    severity: 'critical'
  },
  {
    name: 'DDoS攻击',
    description: 'DDoS攻击应急处理',
    count: emergencyScenarios.filter(s => s.category === 'DDoS攻击').length,
    severity: 'high'
  },
  {
    name: '内部威胁',
    description: '内部人员安全事件处理',
    count: emergencyScenarios.filter(s => s.category === '内部威胁').length,
    severity: 'high'
  }
];

export default emergencyScenarios;
