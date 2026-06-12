# DeFi 安全与闪电贷攻击深度分析

---

## 一、DeFi 协议核心机制

### 1.1 AMM (自动做市商)

```
AMM = 恒定乘积做市商 (Uniswap V2):

公式：x * y = k
  x = Token A 数量, y = Token B 数量, k = 恒定乘积

价格：price_A = y / x
  有人买入 A → 池中A减少 → price_A上升 (滑点)

安全风险：
  ✗ 价格预言机操纵：
    闪电贷 → 在一个区块内巨量买入A → 临时推高price_A 
    → 借贷协议看到高价 → 超额抵押 → 借出更多 
    → 闪电贷归还 → 价格回落 → 借贷协议产生坏账
```

### 1.2 借贷协议 (Compound/Aave)

```
超额抵押模型：
  存入$150 ETH → 可借$100 USDC (150%抵押率)

清算机制：
  抵押品价值下跌 → 抵押率<清算线 → 
  任何人都可偿还借款人债务并获得抵押品(含清算折扣)

攻击面：
  - 价格预言机操纵 → 虚假清算(制造假下跌→清算其他用户)
  - 闪贷+清算 → 同区块内借入→触发清算→获利
```

---

## 二、闪电贷攻击

### 2.1 经典闪电贷攻击流程

```
典型攻击链 (bZx攻击简例, 2020.2)：

Step 1: 闪电贷借入 10,000 ETH (从dYdX)

Step 2: 价格操纵
   5,500 ETH → 存入Compound → 借出 112 WBTC
   1,300 ETH → Kyber → 买入更多WBTC(拉高WBTC/ETH价格)
   
Step 3: 利用被操纵的价格
   在另一个交易所用剩余ETH高价卖出WBTC
   → 因为WBTC被人为拉高

Step 4: 归还闪电贷 (如 10,000 ETH + 手续费)

净利: ~35万美元

根本原因：
  Kyber/Compound使用了即时的(被操纵的)价格，而不是时间加权平均值
```

### 2.2 TWAP 防御

```solidity
// ❌ 使用即时价格 (Unsafe)
uint price = getReserves();
// → 同一区块内闪电贷可操纵

// ✅ 使用TWAP (Uniswap V2)
function getTWAP(address pair, uint priceCumulativeLast) internal view returns (uint) {
    // 获取30分钟前的累积价格
    (uint price0Cumulative, uint price1Cumulative, uint32 blockTimestamp) = 
        UniswapV2OracleLibrary.currentCumulativePrices(pair);
    
    // TWAP = (当前累积价格 - 30分钟前累积价格) / 30分钟
    return (price1Cumulative - priceCumulativeLast) / (blockTimestamp - lastTimestamp);
}
// → 攻击者需要连续操纵价格30分钟(成本巨大)

// ✅ 使用 Chainlink 预言机 (推荐)
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
AggregatorV3Interface priceFeed = AggregatorV3Interface(0x...);
(, int price, , ,) = priceFeed.latestRoundData();
// → Chainlink聚合多交易所价格+时间延迟 → 难以操纵
```

---

## 三、预言机攻击

```
预言机 (Oracle) = 区块链获取链下数据的桥梁

攻击类型：

1. 单个DEX价格操纵
   → 解决：聚合多DEX价格(Chainlink)

2. 闪电贷+价格操纵
   → 解决：TWAP(时间加权平均价格)
   → 施加至少1-2个区块的延迟

3. 预言机停止更新(Staleness)
   → 解决：检查latestRoundData时间戳
   if (block.timestamp - updatedAt > 3600) revert("Stale price");

4. 反向预言机攻击(价格下限)
   → 某些DeFi使用"最大价格"保护 → 
   攻击者让预言机报告"最低价" → 也能获利
```

---

## 四、无常损失 (Impermanent Loss)

```
无常损失：
  AMM LP(流动性提供者)的价值 vs 简单持有两种资产的价值差

公式：IL = 2 * sqrt(price_ratio) / (1 + price_ratio) - 1

价格变化 25%:  IL ≈ 0.6%
价格变化 50%:  IL ≈ 2.0%
价格变化 100%: IL ≈ 5.7%
价格变化 500%: IL ≈ 25.5%

安全视角：
  无常损失 + 滑点攻击 = 用户可能承受的组合损失
  → 协议应让用户明确IL风险
  → 某些协议(如Curve)用稳定币池(价格比≈1)最小化IL
```

---

## 五、DeFi 安全工具

```bash
# DeFi安全分析工具
# DeFiLlama — DeFi TVL + 协议列表
# https://defillama.com

# Rekt News — DeFi黑客事件数据库
# https://rekt.news

# DeFiHackLabs — DeFi攻击复现
# https://github.com/SunWeb3Sec/DeFiHackLabs

# BlockSec Phalcon — 交易模拟+检测
# https://phalcon.blocksec.com
```

---

## 六、Checklist

- [ ] 使用去中心化预言机(Chainlink/TWAP)
- [ ] 禁止使用即时DEX价格
- [ ] 闪电贷攻击防护(价格延迟验证)
- [ ] 清算机制安全(防止价格操纵触发虚假清算)
- [ ] Slippage保护(Tx中设置最大滑点)
- [ ] 第三方安全审计(>2家)
- [ ] 经济模型安全(博弈论分析)
- [ ] 时间锁(Timelock)部署(重大变更需48小时等待)
- [ ] 紧急暂停(Circuit Breaker / Pause Guardian)
