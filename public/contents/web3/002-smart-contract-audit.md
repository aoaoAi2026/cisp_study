# 智能合约漏洞审计实战 (Solidity)

---

## 一、常见漏洞 Top 10

### 1. 重入攻击 (Reentrancy)

```solidity
// ❌ 漏洞代码
contract VulnerableBank {
    mapping(address => uint) public balances;

    function withdraw() public {
        uint amount = balances[msg.sender];
        // ⚠️ 先转账后更新状态 → 重入漏洞！
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
        balances[msg.sender] = 0;  // 状态更新太晚了！
    }
}

// 攻击者合约
contract Attacker {
    VulnerableBank bank;
    
    receive() external payable {
        // 接收到ETH → 再次调用withdraw() → 
        // 如果余额还没更新 → 再次提款！
        if (address(bank).balance >= 1 ether) {
            bank.withdraw();
        }
    }
}

// ✅ 修复方案1：先更新状态
function withdraw() public {
    uint amount = balances[msg.sender];
    balances[msg.sender] = 0;  // ★ 先更新
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}

// ✅ 修复方案2：重入锁（OpenZeppelin ReentrancyGuard）
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
contract SafeBank is ReentrancyGuard {
    function withdraw() public nonReentrant {
        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
    }
}
```

### 2. 整数溢出 (Integer Overflow/Underflow)

```solidity
// Solidity 0.8+ 自动检查溢出(内置SafeMath)
// Solidity <0.8 需要手动使用SafeMath

// ❌ Solidity 0.7 漏洞代码
contract Token {
    mapping(address => uint256) public balanceOf;
    
    function transfer(address to, uint256 amount) public {
        // ⚠️ 可能溢出(不会revert)
        require(balanceOf[msg.sender] - amount >= 0);
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
    }
}

// ✅ Solidity 0.8+ 自动revert
// 或使用OpenZeppelin SafeMath
```

### 3. 访问控制缺失

```solidity
// ❌ 没有权限控制
contract Bank {
    address public owner;
    
    function changeOwner(address newOwner) public {  // ⚠️ public!
        owner = newOwner;
    }
}

// ✅ 加上权限修饰器
contract SafeBank {
    address public owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    function changeOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }
    
    // 使用OpenZeppelin Ownable
    // import "@openzeppelin/contracts/access/Ownable.sol";
}
```

---

## 二、闪电贷漏洞利用

```
闪电贷 (Flash Loan)：
  在同一笔交易中借出并归还，无需抵押
  前提：借贷+还款都在同一交易中

攻击模式：
  1. 闪电贷借出巨额资产(如从AAVE借1亿美元)
  2. 操纵价格预言机/利用算法漏洞
  3. 获利
  4. 归还贷款
  5. 净赚差价

防御核心：
  - 不要使用Spot Price作为预言机(用TWAP)
  - 关键操作加锁(同一交易中不可重复调用)
```

---

## 三、审计工具链

### 3.1 Slither 静态分析

```bash
pip install slither-analyzer
slither .  # 分析当前Solidity项目

# 常用检测器
slither . --detect reentrancy-eth,reentrancy-no-eth,unused-return
```

### 3.2 Foundry 测试

```solidity
// test/Bank.t.sol
contract BankTest is Test {
    Bank bank;
    
    function setUp() public {
        bank = new Bank();
    }
    
    function testWithdraw() public {
        bank.deposit{value: 1 ether}();
        bank.withdraw();
        assertEq(address(bank).balance, 0);
    }
    
    function testFailReentrancy() public {
        // 模拟攻击者尝试重入
        Attacker attacker = new Attacker(address(bank));
        // ... 执行攻击 → 预期 revert
    }
}
```

### 3.3 Echidna 模糊测试

```solidity
// Echidna 测试不变式
contract TestBank is Bank {
    function echidna_no_leak() public view returns (bool) {
        // 不变式：合约永不亏钱
        return address(this).balance >= totalDeposits;
    }
}
```

---

## 四、真实案例

| 时间 | 案例 | 漏洞类型 | 损失 |
|------|------|---------|------|
| 2016 | The DAO | 重入攻击 | $60M (导致ETH硬分叉) |
| 2021 | Poly Network | 跨链桥逻辑漏洞 | $611M (大部分返还) |
| 2022 | Wormhole | 签名验证绕过 | $326M |
| 2022 | Ronin Bridge | 验证人私钥泄露 | $625M |
| 2023 | Euler Finance | 捐助函数+清算逻辑 | $197M (返还) |
| 2023 | KyberSwap | 价格操纵+Tick操纵 | $47M |
| 2024 | Radiant Capital | 多签攻击+合约操作 | $50M+ |

---

## 五、Checklist

- [ ] Slither 静态分析通过(零严重漏洞)
- [ ] 第三方审计(至少2家独立审计机构)
- [ ] Foundry/Echidna 测试覆盖>90%
- [ ] 使用OpenZeppelin标准库(不重复造轮子)
- [ ] 重入防护(所有外部调用后状态更新)
- [ ] 访问控制(Ownable/RBAC)
- [ ] 预言机安全(使用Chainlink TWAP)
- [ ] 时间戳依赖评估(不用block.timestamp做随机)
- [ ] Gas消耗风险(Gas Limit DoS)
- [ ] 紧急暂停机制(Circuit Breaker)
