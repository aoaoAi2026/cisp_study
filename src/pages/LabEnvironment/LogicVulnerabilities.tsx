import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, Button } from '../../components/UI';

export const LogicVulnerabilities: React.FC = () => {
  const [scenario, setScenario] = useState<'price'|'coupon'|'authz'|'step'|'race'>('price');

  // Price tampering state
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(99);
  const [priceMsg, setPriceMsg] = useState('');

  // Coupon abuse state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);
  const [couponMsg, setCouponMsg] = useState('');

  // Authz bypass state
  const [viewUserId, setViewUserId] = useState(1);
  const [authzMsg, setAuthzMsg] = useState('');

  // Step bypass state
  const [orderStep, setOrderStep] = useState(0);
  const [stepMsg, setStepMsg] = useState('');

  // Race condition state
  const [balance, setBalance] = useState(1000);
  const [raceMsg, setRaceMsg] = useState('');

  const resetStates = () => {
    setQuantity(1); setPrice(99); setPriceMsg('');
    setCouponCode(''); setAppliedCoupons([]); setCouponMsg('');
    setViewUserId(1); setAuthzMsg('');
    setOrderStep(0); setStepMsg('');
    setBalance(1000); setRaceMsg('');
  };

  const handleChangeScenario = (s: typeof scenario) => {
    setScenario(s);
    resetStates();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(['price','coupon','authz','step','race'] as const).map(s => (
          <button key={s} onClick={() => handleChangeScenario(s)}
            className={`px-4 py-2 rounded-lg text-sm transition ${scenario===s ? 'bg-pink-500 text-white' : 'bg-pink-500/10 text-pink-400 hover:bg-pink-500/20'}`}>
            {{price:'价格篡改',coupon:'优惠券滥用',authz:'越权访问',step:'步骤绕过',race:'竞态条件'}[s]}
          </button>
        ))}
      </div>

      <Card className="border-pink-500/20">
        {scenario === 'price' && (<>
          <h3 className="text-pink-400 font-medium mb-1">价格篡改</h3>
          <p className="text-sm text-gray-400 mb-4">在线商城允许用户通过修改请求参数改变商品价格</p>
          <div className="flex items-center gap-3 flex-wrap">
            <div><label className="text-xs text-gray-400 block mb-1">数量</label><input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-20 px-3 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm"/></div>
            <div><label className="text-xs text-gray-400 block mb-1">单价(¥) 可篡改</label><input type="number" value={price} onChange={e => {setPrice(Number(e.target.value));setPriceMsg(Number(e.target.value)<0?'⚠️ 你在尝试负价格攻击！':'');}} className="w-24 px-3 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm"/></div>
            <div className="pt-5"><Button onClick={() => {const total=price*quantity;setPriceMsg(price<0?'🚨 漏洞利用成功！你通过修改价格参数以0元购买了商品！':price<50?'⚠️ 检测到异常价格！但系统未做服务端验证...':`✅ 正常购买：${quantity}件 × ¥${price} = ¥${total}`);}} className="!bg-pink-500 text-white hover:!bg-pink-400">购买</Button></div>
          </div>
          {priceMsg && <p className="text-sm text-pink-300 mt-3">{priceMsg}</p>}
          <div className="mt-4 p-3 bg-pink-500/5 rounded-lg text-xs text-gray-500"><p className="text-pink-400 mb-1">🛡️ 防御建议:</p>服务端验证价格，不信任客户端传来的价格参数</div>
        </>)}

        {scenario === 'coupon' && (<>
          <h3 className="text-pink-400 font-medium mb-1">优惠券滥用</h3>
          <p className="text-sm text-gray-400 mb-4">优惠券系统允许重复使用同一优惠码或叠加使用</p>
          <div className="flex gap-2 mb-3">
            <input value={couponCode} onChange={e => setCouponCode(e.target.value)} onKeyDown={e => e.key==='Enter' && (()=>{if(appliedCoupons.includes(couponCode)){setCouponMsg('🚨 漏洞！同一优惠券被重复使用！');}else if(couponCode==='VIP50'||couponCode==='NEW50'){setAppliedCoupons([...appliedCoupons,couponCode]);setCouponMsg(`✅ 优惠券 "${couponCode}" 已应用！`);}else{setCouponMsg('❌ 无效优惠码');}setCouponCode('');})()} placeholder="输入优惠码 (试试 VIP50 或 NEW50)..." className="flex-1 px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-pink-500"/>
            <Button onClick={() => {if(appliedCoupons.includes(couponCode)){setCouponMsg('🚨 漏洞！同一优惠券被重复使用！');}else if(couponCode==='VIP50'||couponCode==='NEW50'){setAppliedCoupons([...appliedCoupons,couponCode]);setCouponMsg(`✅ 优惠券 "${couponCode}" 已应用！`);}else{setCouponMsg('❌ 无效优惠码');}setCouponCode('');}} className="!bg-pink-500 text-white hover:!bg-pink-400">应用</Button>
          </div>
          {appliedCoupons.length>0&&<div className="flex gap-1 flex-wrap mb-2">{appliedCoupons.map((c,i)=><span key={i} className="text-xs px-2 py-1 rounded bg-pink-500/20 text-pink-300">{c}</span>)}</div>}
          {couponMsg && <p className="text-sm text-pink-300">{couponMsg}</p>}
          <p className="text-xs text-gray-500 mt-2">💡 尝试重复使用同一优惠码</p>
          <div className="mt-4 p-3 bg-pink-500/5 rounded-lg text-xs text-gray-500"><p className="text-pink-400 mb-1">🛡️ 防御建议:</p>服务端记录每个用户的优惠券使用状态，防止重复使用</div>
        </>)}

        {scenario === 'authz' && (<>
          <h3 className="text-pink-400 font-medium mb-1">越权访问</h3>
          <p className="text-sm text-gray-400 mb-4">通过修改URL中的ID参数访问其他用户的数据</p>
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm text-gray-400">用户ID:</label>
            <input type="number" value={viewUserId} onChange={e => setViewUserId(Number(e.target.value))} className="w-20 px-3 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm"/>
            <Button onClick={() => {setAuthzMsg(viewUserId===1?'✅ 查看自己的订单：Order#1001, 金额¥199':viewUserId===2?'🚨 越权漏洞！成功查看用户#2的订单：Order#2001, 金额¥999':'🚨 越权漏洞！查看用户#'+viewUserId+'的敏感数据');}} className="!bg-pink-500 text-white hover:!bg-pink-400">查看订单</Button>
          </div>
          {authzMsg && <p className="text-sm text-pink-300">{authzMsg}</p>}
          <p className="text-xs text-gray-500 mt-2">💡 你是用户#1，试试查看用户#2的订单</p>
          <div className="mt-4 p-3 bg-pink-500/5 rounded-lg text-xs text-gray-500"><p className="text-pink-400 mb-1">🛡️ 防御建议:</p>每次请求验证用户权限，确保只能访问自己的数据</div>
        </>)}

        {scenario === 'step' && (<>
          <h3 className="text-pink-400 font-medium mb-1">步骤绕过</h3>
          <p className="text-sm text-gray-400 mb-4">跳过支付步骤直接完成订单</p>
          <div className="flex gap-2 mb-3">
            <Button onClick={() => {if(orderStep===0){setOrderStep(1);setStepMsg('📋 步骤1: 确认订单信息');}else if(orderStep===1){setOrderStep(2);setStepMsg('💳 步骤2: 跳转到支付页面');}else if(orderStep===2){setOrderStep(3);setStepMsg('✅ 步骤3: 支付完成，订单确认');}else setStepMsg('🎉 订单已完成');}} className="!bg-pink-500 text-white hover:!bg-pink-400"><ArrowRight size={16}/> 下一步</Button>
            {orderStep < 3 && <Button variant="outline" onClick={() => {if(orderStep===0){setOrderStep(3);setStepMsg('🚨 漏洞！直接跳过了支付步骤完成订单！');}else setStepMsg('已经在后续步骤中');}} className="border-red-500/30 text-red-400 hover:bg-red-500/10">⚡ 跳过支付(漏洞利用)</Button>}
          </div>
          <div className="flex gap-2">{[1,2,3].map(s=><div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${s<=orderStep?'bg-green-500 text-white':'bg-gray-700 text-gray-500'}`}>{s}</div>)}</div>
          {stepMsg && <p className="text-sm text-pink-300 mt-3">{stepMsg}</p>}
          <div className="mt-4 p-3 bg-pink-500/5 rounded-lg text-xs text-gray-500"><p className="text-pink-400 mb-1">🛡️ 防御建议:</p>服务端记录当前步骤状态，不允许跳过必要步骤</div>
        </>)}

        {scenario === 'race' && (<>
          <h3 className="text-pink-400 font-medium mb-1">竞态条件</h3>
          <p className="text-sm text-gray-400 mb-4">并发请求导致超额提现/超额购买</p>
          <p className="text-sm text-gray-300 mb-3">当前余额: <span className="text-green-400 font-mono">¥{balance}</span></p>
          <div className="flex gap-2 mb-3">
            <Button onClick={() => {if(balance>=500){setTimeout(()=>setBalance(b=>b-500),100);setRaceMsg('💰 提现请求已发送：¥500');}else{setRaceMsg('❌ 余额不足');}}} className="!bg-pink-500 text-white hover:!bg-pink-400">💰 提现 ¥500</Button>
            <Button onClick={() => {if(balance>=500){setRaceMsg('⚡ 同时发送3个并发提现请求...');setTimeout(()=>{setBalance(b=>Math.max(0,b-1500));setRaceMsg('🚨 竞态条件利用成功！在余额检查后、扣款前发送了3个请求\n原始余额: ¥1000 → 当前余额: ¥-500');},500);}}} className="bg-red-600 hover:bg-red-500">⚡ 并发攻击</Button>
          </div>
          {raceMsg && <pre className="text-sm text-pink-300 whitespace-pre-wrap">{raceMsg}</pre>}
          <div className="mt-4 p-3 bg-pink-500/5 rounded-lg text-xs text-gray-500"><p className="text-pink-400 mb-1">🛡️ 防御建议:</p>使用数据库行锁或乐观锁控制并发访问，余额检查与扣款原子化</div>
        </>)}
      </Card>
    </div>
  );
};
