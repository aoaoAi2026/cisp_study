# Misc 常见隐写术速查（图片 / 音频 / 压缩包 / 流量）

## 1. 文件初步检查

```bash
file suspect.png              # 真正格式
binwalk suspect.png           # 内部藏文件
foremost -i suspect.png       # 按文件类型提取
strings suspect.png | head    # 可读字符串
exiftool suspect.png          # EXIF 元数据
xxd suspect.png | head -3     # 16 进制头
```

## 2. 图片隐写

### 2.1 常见工具

| 工具 | 用途 |
|------|------|
| **Stegsolve** | 各通道切换查看 LSB / 调色板 |
| **zsteg**（PNG/BMP） | 自动扫描隐藏数据 |
| **stegpy** | 基于 LSB 的隐写 |
| **StegHide** | JPG 隐写，需要密码 |
| **OutGuess / F5 / StegJPEG** | JPG 频域隐写 |
| **Pngcheck** | 检查 PNG chunk 错误 / 额外数据 |
| **CyberChef** | 在线图片查看与处理 |

### 2.2 常见模式

- 图片尾后追加文件（`binwalk -e` 解）
- 末尾 `zip / rar / 7z` 等压缩包
- PNG 的 `tEXt` / `iTXt` / `zTXt` chunk 中藏数据
- JPG 的 Exif / Comment 段
- LSB（最低有效位）隐写（每个像素 R/G/B/A 的 1 bit 拼接）
- `steghide extract -sf pic.jpg -p pass`
- **盲水印**：BVM / DCT 频域 / 相位相关

## 3. 音频隐写

- **频谱图**（Audacity / Sonic Visualiser）：spectrogram 看到 flag
- **LSB / MP3Stego / Silenteye**
- **DTMF（电话拨号音）** / **Morse**（嘀嘀嗒嗒长短音）
- **SSTV（慢扫描电视）**：图像编码成音频

## 4. 视频隐写

- 逐帧分析：`ffmpeg -i video.mp4 frames/%04d.png`
- 帧间差异、隐藏字幕轨、音频轨同上

## 5. 压缩包 / 密码

- **密码破解**：ARCHPR（Windows）、fcrackzip、`john` + `rar2john / zip2john / 7z2john`
- **伪加密**：修改压缩包加密位，无需密码也能打开
- **CRC32 碰撞**：小文件可通过已知 CRC32 暴力恢复内容
- **分卷** / 损坏修复：zip -FF / 7z

## 6. 流量分析（Wireshark / tshark）

```bash
# 过滤 HTTP
tshark -r capture.pcap -Y http.request -T fields -e http.request.uri

# 提取 HTTP 对象
tshark -r capture.pcap --export-objects http,./out

# 按字符串查找
tshark -r capture.pcap -Y 'frame contains "flag"'

# TCP 流跟踪（Wireshark 右键 Follow TCP Stream）
```

**常见考点**

- HTTP POST 上传 / 下载的文件
- DNS exfiltration（大量奇怪子域名，base32/hex 编码）
- ICMP / TCP 选项 / UDP 数据隐藏
- TLS 握手 + 会话密钥（`SSLKEYLOGFILE` 可解密）
- USB 流量还原键盘输入 / 鼠标轨迹

## 7. QR 二维码

- 残缺二维码可使用 **QRazyBox** 恢复
- 注意：颜色反转、定位点被涂抹、Data Mask、Reed-Solomon 纠错
- 图像太小可上采样后再识别

## 8. 编码类型汇总

| 类型 | 识别特征 |
|------|---------|
| Base64 | `A-Z a-z 0-9 + / =`，长度是 4 的倍数 |
| Base32 | `A-Z 2-7 =` |
| Base16 / Hex | `0-9 A-F`（或 `0x` 前缀） |
| Base58 | `123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`（比特币） |
| URL Encode | `%xx` |
| HTML Entity | `&#123;` / `&#x7B;` |
| Unicode Escape | `\u4f60\u597d` |
| Brainfuck | `><+-.,[]` 字符 |
| JSFuck / AAEncode / JJEncode | 只用少量字符构造 JS |
| UUEncode / XXEncode | 行首 `M` 等 |
| Bubble Babble / Bubble | `xexex-...` 形式 |

## 9. 常用 Bash 一行

```bash
# 提取 base64 解码
cat data.txt | base64 -d

# 字符串十六进制互转
echo -n "flag" | xxd -p
echo 666c6167 | xxd -r -p

# xor 单字节 key（用 Python）
python3 -c "import sys; d=open(sys.argv[1],'rb').read(); [print(bytes(b^k for b in d)) for k in range(256)]" | grep -a flag
```
