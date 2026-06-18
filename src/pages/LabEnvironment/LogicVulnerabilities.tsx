import React, { useState } from 'react';
import { ArrowRight, AlertTriangle, Shield, CheckCircle, Copy, Zap, ShoppingCart, Ticket, UserX, SkipForward, Timer } from 'lucide-react';
import { Card, Button } from '../../components/UI';

type Scenario = 'price'|'coupon'|'authz'|'step'|'race';

const scenarioInfo: Record<Scenario, {name:string; cwe:string; desc:string; realCase:string; impact:string; difficulty:'低'|'中'|'高'}> = {
  price:    { name:'价格篡改', cwe:'CWE-602', desc:'客户端可修改商品价格参数，服务端未做二次校验', realCase:'2023年某电商平台因前端验证导致用户可0元购买商品', impact:'直接经济损失，订单系统被绕过', difficulty:'低' },
  coupon:   { name:'优惠券滥用', cwe:'CWE-841', desc:'优惠券系统允许重复使用、叠加、或越权使用优惠码', realCase:'某外卖平台优惠券可无限叠加导致高额订单免费', impact:'营销损失，黑产薅羊毛', difficulty:'低' },
  authz:    { name:'越权访问', cwe:'CWE-639', desc:'通过修改资源ID参数访问其他用户的数据或功能', realCase:'Facebook IDOR漏洞可查看任意用户私密照片（2018）', impact:'数据泄露，隐私侵犯', difficulty:'中' },
  step:     { name:'步骤绕过', cwe:'CWE-841', desc:'跳过业务流中的必要步骤（支付、验证等）直接完成操作', realCase:'某航空公司跳过支付步骤直接出票（2019）', impact:'业务逻辑被破坏，直接损失', difficulty:'中' },
  race:     { name:'竞态条件', cwe:'CWE-362', desc:'并发请求绕过原子操作，在余额检查与扣款之间发起攻击', realCase:'某银行转账接口竞态条件导致超额提现（2020）', impact:'超额提现/购买，金融损失', difficulty:'高' },
};

export const LogicVulnerabilities: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>('price');
  const [exploitLog, setExploitLog] = useState<string[]>([]);
  const [showDetail, setShowDetail] = useState(false);

  // Price tampering
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(99);
  const [priceMsg, setPriceMsg] = useState('');
  const [priceExploited, setPriceExploited] = useState(false);

  // Coupon abuse
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponAbuseCount, setCouponAbuseCount] = useState(0);

  // Authz bypass
  const [viewUserId, setViewUserId] = useState(1);
  const [authzMsg, setAuthzMsg] = useState('');
  const [authzLeakCount, setAuthzLeakCount] = useState(0);

  // Step bypass
  const [orderStep, setOrderStep] = useState(0);
  const [stepMsg, setStepMsg] = useState('');

  // Race condition
  const [balance, setBalance] = useState(1000);
  const [raceMsg, setRaceMsg] = useState('');
  const [attackCount, setAttackCount] = useState(0);

  // === Mock user database ===
  const userDb = [
    { id:1, name:'你的账户', orders:['Order#1001 - ¥199 (手机壳)','Order#1002 - ¥59 (数据线)'], email:'you@example.com', role:'普通用户' },
    { id:2, name:'张三', orders:['Order#2001 - ¥999 (机械键盘)','Order#2002 - ¥1999 (显示器)','Order#2003 - ¥8999 (RTX 5080)'], email:'zhangsan@example.com', role:'VIP用户' },
    { id:3, name:'管理员', orders:['Order#9001 - ¥0 (内部调拨)','Order#9002 - ¥0 (系统账号)'], email:'admin@internal.com', role:'系统管理员' },
  ];

  // === Suggested exploit payloads for each scenario ===
  const exploitSuggestions: Record<Scenario, {label:string; action:()=>void}[]> = {
    price: [
      { label:'🔽 改成 0 元', action:()=>{setPrice(0);setPriceMsg('⚠️ 价格被改为 ¥0');} },
      { label:'🔽 改成负数 (-99)', action:()=>{setPrice(-99);setPriceMsg('🚨 负价格攻击！篡改价格为 ¥-99');} },
      { label:'🔽 改成 0.01 元', action:()=>{setPrice(0.01);setPriceMsg('⚠️ 价格被改为 ¥0.01');} },
    ],
    coupon: [
      { label:'🔄 重复使用 VIP50', action:()=>{if(appliedCoupons.includes('VIP50')){setCouponMsg('🚨 漏洞！同一优惠券被重复使用！');setCouponAbuseCount(c=>c+1);addLog('优惠券滥用: 重复使用 VIP50');}else{setCouponMsg('请先应用 VIP50 优惠券');}} },
      { label:'📊 叠加使用', action:()=>{if(!appliedCoupons.includes('VIP50')) setAppliedCoupons([...appliedCoupons,'VIP50']);if(!appliedCoupons.includes('NEW50')) setAppliedCoupons([...appliedCoupons.filter(c=>c!=='NEW50'),'NEW50']);setCouponMsg('🔍 发现多张优惠券被叠加使用（正常应只允许一张）');setCouponAbuseCount(c=>c+1);} },
      { label:'🎫 使用过期券 OLD99', action:()=>{setCouponCode('OLD99');setCouponMsg('🚨 已过期的优惠券 OLD99 仍可使用！');addLog('优惠券滥用: 使用过期优惠券 OLD99');} },
    ],
    authz: [
      { label:'👤 查看用户#2', action:()=>{setViewUserId(2);setAuthzMsg(getAuthzResult(2));setAuthzLeakCount(c=>c+1);} },
      { label:'🔑 查看管理员#3', action:()=>{setViewUserId(3);setAuthzMsg(getAuthzResult(3));setAuthzLeakCount(c=>c+1);} },
      { label:'🔍 遍历所有用户', action:()=>{const ids=[1,2,3];ids.forEach((id,i)=>setTimeout(()=>{setViewUserId(id);setAuthzMsg(getAuthzResult(id));setAuthzLeakCount(c=>c+1);},i*800));} },
    ],
    step: [],
    race: [],
  };

  const getAuthzResult = (id: number) => {
    if (id === 1) return '✅ 查看自己的数据: 订单列表如上';
    const user = userDb.find(u => u.id === id);
    return `🚨 越权漏洞！成功查看 ${user?.name}(ID#${id}) 的数据:\n${user?.orders.join('\n')}\n邮箱: ${user?.email}\n角色: ${user?.role}`;
  };

  const addLog = (msg: string) => {
    setExploitLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 9)]);
  };

  const resetStates = () => {
    setQuantity(1); setPrice(99); setPriceMsg(''); setPriceExploited(false);
    setCouponCode(''); setAppliedCoupons([]); setCouponMsg(''); setCouponAbuseCount(0);
    setViewUserId(1); setAuthzMsg(''); setAuthzLeakCount(0);
    setOrderStep(0); setStepMsg('');
    setBalance(1000); setRaceMsg(''); setAttackCount(0);
    setExploitLog([]);
  };

  const handleChangeScenario = (s: Scenario) => {
    setScenario(s);
    resetStates();
  };

  const totalExploits = (scenario==='price' && (price<0||price===0) ? 1:0) +
    (scenario==='coupon'?couponAbuseCount:0) +
    (scenario==='authz'?authzLeakCount:0) +
    (scenario==='step'&&orderStep===3?1:0) +
    (scenario==='race'?attackCount:0);

  const icons: Record<Scenario, React.ReactNode> = {
    price: <ShoppingCart size={14}/>, coupon: <Ticket size={14}/>, authz: <UserX size={14}/>,
    step: <SkipForward size={14}/>, race: <Timer size={14}/>,
  };

  return (
    <div className="space-y-4">
      {/* Scenario info card */}
      <Card className="border-pink-500/15 bg-pink-500/[0.02]">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-pink-400 font-medium">{scenarioInfo[scenario].name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300">{scenarioInfo[scenario].cwe}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                scenarioInfo[scenario].difficulty==='低'?'bg-green-500/20 text-green-400':
                scenarioInfo[scenario].difficulty==='中'?'bg-yellow-500/20 text-yellow-400':
                'bg-red-500/20 text-red-400'}`}>
                难度: {scenarioInfo[scenario].difficulty}
              </span>
            </div>
            <p className="text-sm text-gray-400">{scenarioInfo[scenario].desc}</p>
            {showDetail && (
              <div className="mt-2 p-2 bg-black/30 rounded-lg text-xs text-gray-500 space-y-1">
                <p><span className="text-pink-400">📋 真实案例:</span> {scenarioInfo[scenario].realCase}</p>
                <p><span className="text-red-400">💥 影响:</span> {scenarioInfo[scenario].impact}</p>
              </div>
            )}
          </div>
          <button onClick={() => setShowDetail(!showDetail)}
            className="text-xs text-gray-500 hover:text-pink-400 transition flex-shrink-0">
            {showDetail ? '收起详情 ▲' : '展开详情 ▼'}
          </button>
        </div>
      </Card>

      {/* Scenario tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {(Object.keys(scenarioInfo) as Scenario[]).map(s => (
          <button key={s} onClick={() => handleChangeScenario(s)}
            className={`px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 ${
              scenario===s ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-pink-500/10 text-pink-400 hover:bg-pink-500/20'}`}>
            {icons[s]}{scenarioInfo[s].name}
          </button>
        ))}
      </div>

      {/* Main interaction card */}
      <Card className="border-pink-500/20">
        {/* === Price Tampering === */}
        {scenario === 'price' && (<>
          <h3 className="text-pink-400 font-medium mb-1 flex items-center gap-2">
            <ShoppingCart size={16}/> 价格篡改演示
          </h3>
          <p className="text-sm text-gray-400 mb-4">在线商城允许用户通过修改请求参数改变商品价格。服务端信任了客户端传来的 price 字段。</p>

          <div className="p-3 bg-black/30 rounded-lg mb-4">
            <p className="text-xs text-gray-500 mb-2">💻 请求模拟:</p>
            <code className="text-xs text-green-400 block mb-1">POST /api/order/create</code>
            <code className="text-xs text-gray-300 block">{'{'}</code>
            <code className="text-xs text-gray-300 block">  "product_id": 1001,</code>
            <code className="text-xs text-gray-300 block">  "quantity": {quantity},</code>
            <code className="text-xs text-yellow-400 block">  "price": <span className={price<99?'text-red-400':'text-yellow-400'}>{price}</span>  ← 客户端可控!</code>
            <code className="text-xs text-gray-300 block">{'}'}</code>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <div><label className="text-[11px] text-gray-400 block mb-1">数量</label>
              <input type="number" value={quantity} min={1} onChange={e => setQuantity(Number(e.target.value)||1)}
                className="w-full px-3 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-pink-500"/></div>
            <div><label className="text-[11px] text-gray-400 block mb-1">单价(¥) <span className="text-red-400">可篡改</span></label>
              <input type="number" value={price} onChange={e => {const v=Number(e.target.value);setPrice(v);setPriceMsg(v<0?'🚨 你在尝试负价格攻击！':v===0?'⚠️ 价格被改为 ¥0':v>0&&v<99?`⚠️ 检测到异常价格 ¥${v}！但系统未做服务端验证...`:'');}}
                className="w-full px-3 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-pink-500"/></div>
            <div><label className="text-[11px] text-gray-400 block mb-1">操作</label>
              <Button onClick={() => {const total=price*quantity;
                if(price<0) {setPriceMsg('🚨 漏洞利用成功！你通过修改价格参数以负数金额购买了商品！系统还要倒找你钱！');addLog('价格篡改: 负价格攻击成功');setPriceExploited(true);}
                else if(price===0){setPriceMsg('🚨 漏洞利用成功！你以 ¥0 购买了商品！');addLog('价格篡改: 零元购成功');setPriceExploited(true);}
                else if(price<50){setPriceMsg(`⚠️ 订单已创建：${quantity}件 × ¥${price} = ¥${total}\n服务端未校验价格，可能存在漏洞`);addLog(`价格篡改: 异常低价 ¥${price}`);}
                else{setPriceMsg(`✅ 正常订单：${quantity}件 × ¥${price} = ¥${total}`);}
              }} className="!bg-pink-500 text-white hover:!bg-pink-400 w-full !py-2">
                <ShoppingCart size={14}/> 下单</Button></div>
          </div>

          {/* Quick exploit buttons */}
          <div className="flex gap-1.5 flex-wrap mb-3">
            {exploitSuggestions.price.map((s,i) => (
              <button key={i} onClick={s.action}
                className="px-2 py-1 rounded text-[11px] bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 transition border border-pink-500/20">
                {s.label}
              </button>
            ))}
          </div>

          {priceMsg && (
            <pre className={`p-3 rounded-lg text-xs whitespace-pre-wrap font-mono border ${
              priceMsg.includes('漏洞') ? 'bg-red-500/10 border-red-500/30 text-red-300' :
              priceMsg.includes('异常') ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' :
              'bg-green-500/10 border-green-500/30 text-green-300'}`}>
              {priceMsg}
            </pre>
          )}

          <div className="mt-4 space-y-2">
            <div className="p-3 bg-pink-500/5 rounded-lg border border-pink-500/15">
              <p className="text-pink-400 text-xs font-medium mb-2">🛡️ 防御策略</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {[
                  '服务端验证价格，不信任客户端传值',
                  '价格从服务端数据库读取，不接受参数',
                  '订单金额使用服务端计算值',
                  '添加金额异常检测告警',
                ].map((d,i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-400">
                    <Shield size={12} className="text-pink-400 mt-0.5 flex-shrink-0"/>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>)}

        {/* === Coupon Abuse === */}
        {scenario === 'coupon' && (<>
          <h3 className="text-pink-400 font-medium mb-1 flex items-center gap-2">
            <Ticket size={16}/> 优惠券滥用演示
          </h3>
          <p className="text-sm text-gray-400 mb-4">优惠券系统允许重复使用、叠加使用或使用过期优惠券。</p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              {code:'VIP50',desc:'VIP 5折券',color:'text-yellow-400'},
              {code:'NEW50',desc:'新用户5折券',color:'text-blue-400'},
              {code:'OLD99',desc:'已过期券',color:'text-red-400'},
            ].map(c => (
              <div key={c.code}
                className="p-3 rounded-lg bg-black/30 border border-gray-700/50 text-center cursor-pointer hover:border-pink-500/30 transition"
                onClick={() => {setCouponCode(c.code);setCouponMsg(`已选择: ${c.code}`);}}>
                <p className={`text-sm font-mono font-bold ${c.color}`}>{c.code}</p>
                <p className="text-[10px] text-gray-500">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            <input value={couponCode} onChange={e => setCouponCode(e.target.value)}
              onKeyDown={e => e.key==='Enter' && (()=>{
                if(!couponCode.trim())return;
                if(appliedCoupons.includes(couponCode)){
                  setCouponMsg('🚨 漏洞！同一优惠券被重复使用！');setCouponAbuseCount(c=>c+1);addLog(`优惠券滥用: 重复使用 ${couponCode}`);
                }else if(couponCode==='VIP50'||couponCode==='NEW50'){
                  setAppliedCoupons([...appliedCoupons,couponCode]);setCouponMsg(`✅ 优惠券 "${couponCode}" 已应用！`);
                }else if(couponCode==='OLD99'){
                  setAppliedCoupons([...appliedCoupons,'OLD99']);setCouponMsg('🚨 漏洞！已过期的优惠券 OLD99 仍可使用！');setCouponAbuseCount(c=>c+1);addLog('优惠券滥用: 使用过期券 OLD99');
                }else{setCouponMsg('❌ 无效优惠码');}
                setCouponCode('');
              })()}
              placeholder="输入优惠码 (VIP50 / NEW50 / OLD99)..." className="flex-1 px-3 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-pink-500"/>
            <Button onClick={() => {
              if(!couponCode.trim())return;
              if(appliedCoupons.includes(couponCode)){
                setCouponMsg('🚨 漏洞！同一优惠券被重复使用！');setCouponAbuseCount(c=>c+1);addLog(`优惠券滥用: 重复使用 ${couponCode}`);
              }else if(couponCode==='VIP50'||couponCode==='NEW50'){
                setAppliedCoupons([...appliedCoupons,couponCode]);setCouponMsg(`✅ 优惠券 "${couponCode}" 已应用！`);
              }else if(couponCode==='OLD99'){
                setAppliedCoupons([...appliedCoupons,'OLD99']);setCouponMsg('🚨 漏洞！已过期的优惠券 OLD99 仍可使用！');setCouponAbuseCount(c=>c+1);addLog('优惠券滥用: 使用过期券 OLD99');
              }else{setCouponMsg('❌ 无效优惠码');}
              setCouponCode('');
            }} className="!bg-pink-500 text-white hover:!bg-pink-400">应用</Button>
          </div>

          {/* Quick exploit buttons */}
          <div className="flex gap-1.5 flex-wrap mb-3">
            {exploitSuggestions.coupon.map((s,i) => (
              <button key={i} onClick={s.action}
                className="px-2 py-1 rounded text-[11px] bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 transition border border-pink-500/20">
                {s.label}
              </button>
            ))}
          </div>

          {appliedCoupons.length>0 && (
            <div className="mb-3">
              <p className="text-[11px] text-gray-500 mb-1">已应用优惠券 ({appliedCoupons.length})：</p>
              <div className="flex gap-1.5 flex-wrap">
                {appliedCoupons.map((c,i)=><span key={i} className="text-xs px-2 py-1 rounded bg-pink-500/20 text-pink-300 font-mono">{c}</span>)}
              </div>
              {appliedCoupons.length > 1 && (
                <p className="text-xs text-red-400 mt-1">⚠️ 检测到优惠券叠加使用（正常情况下只允许使用一张）</p>
              )}
            </div>
          )}
          {couponMsg && (
            <pre className={`p-3 rounded-lg text-xs whitespace-pre-wrap font-mono border ${
              couponMsg.includes('漏洞') ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-green-500/10 border-green-500/30 text-green-300'}`}>
              {couponMsg}
            </pre>
          )}

          <div className="mt-4 p-3 bg-pink-500/5 rounded-lg border border-pink-500/15">
            <p className="text-pink-400 text-xs font-medium mb-2">🛡️ 防御策略</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {[
                '服务端记录每个用户优惠券使用状态',
                '限制每个用户每张券只能使用一次',
                '禁止多张优惠券叠加使用',
                '实时检查优惠券有效期',
                '优惠券与用户/订单绑定，防止转移',
              ].map((d,i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-400">
                  <Shield size={12} className="text-pink-400 mt-0.5 flex-shrink-0"/><span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* === Authz Bypass === */}
        {scenario === 'authz' && (<>
          <h3 className="text-pink-400 font-medium mb-1 flex items-center gap-2">
            <UserX size={16}/> 越权访问 (IDOR) 演示
          </h3>
          <p className="text-sm text-gray-400 mb-4">通过修改URL中的ID参数查看其他用户的数据。系统未校验当前用户是否有权访问目标资源。</p>

          <div className="p-3 bg-black/30 rounded-lg mb-4">
            <p className="text-xs text-gray-500 mb-2">💻 漏洞请求:</p>
            <code className="text-xs text-green-400">GET /api/users/<span className="text-red-400">{viewUserId}</span>/orders</code>
            <p className="text-xs text-gray-600 mt-1">Cookie: session=user_1_token ← 当前登录用户#1</p>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">目标用户ID:</label>
              <input type="number" value={viewUserId} min={1} onChange={e => setViewUserId(Number(e.target.value)||1)}
                className="w-20 px-3 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-pink-500"/>
            </div>
            <div className="pt-5">
              <Button onClick={() => {
                setAuthzMsg(getAuthzResult(viewUserId));
                if(viewUserId!==1){setAuthzLeakCount(c=>c+1);addLog(`越权访问: 查看用户#${viewUserId}数据`);}
              }} className="!bg-pink-500 text-white hover:!bg-pink-400">
                <UserX size={14}/> 越权查看</Button>
            </div>
          </div>

          {/* Quick exploit buttons */}
          <div className="flex gap-1.5 flex-wrap mb-3">
            {exploitSuggestions.authz.map((s,i) => (
              <button key={i} onClick={s.action}
                className="px-2 py-1 rounded text-[11px] bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 transition border border-pink-500/20">
                {s.label}
              </button>
            ))}
          </div>

          {authzMsg && (
            <pre className={`p-3 rounded-lg text-xs whitespace-pre-wrap font-mono border ${
              authzMsg.includes('越权') ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-green-500/10 border-green-500/30 text-green-300'}`}>
              {authzMsg}
            </pre>
          )}

          {/* User database visualization */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {userDb.map(u => (
              <div key={u.id} onClick={() => {setViewUserId(u.id);setAuthzMsg(getAuthzResult(u.id));if(u.id!==1){setAuthzLeakCount(c=>c+1);addLog(`越权访问: 点击查看${u.name}数据`);}}}
                className={`p-3 rounded-lg border cursor-pointer transition text-center ${
                  viewUserId===u.id ? 'border-pink-500 bg-pink-500/10' : 'border-gray-700/50 bg-black/20 hover:border-gray-500'}`}>
                <p className="text-sm font-medium text-gray-300">{u.name}</p>
                <p className="text-[11px] text-gray-500">ID: {u.id} · {u.role}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-pink-500/5 rounded-lg border border-pink-500/15">
            <p className="text-pink-400 text-xs font-medium mb-2">🛡️ 防御策略</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {[
                '每个请求验证用户是否有权访问目标资源',
                '使用UUID而非自增ID作为资源标识符',
                '资源归属检查：resource.owner === currentUser.id',
                'RBAC/ABAC 细粒度权限控制',
                'API Gateway 统一鉴权拦截',
              ].map((d,i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-400">
                  <Shield size={12} className="text-pink-400 mt-0.5 flex-shrink-0"/><span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* === Step Bypass === */}
        {scenario === 'step' && (<>
          <h3 className="text-pink-400 font-medium mb-1 flex items-center gap-2">
            <SkipForward size={16}/> 步骤绕过演示
          </h3>
          <p className="text-sm text-gray-400 mb-4">跳过支付步骤直接完成订单。业务流程未在服务端强制校验步骤顺序。</p>

          {/* Flow visualization */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            {[
              {step:1,label:'确认订单',icon:'📋'},
              {step:2,label:'支付验证',icon:'💳'},
              {step:3,label:'订单完成',icon:'✅'},
            ].map(s => (
              <React.Fragment key={s.step}>
                <div className={`flex-shrink-0 w-20 h-16 rounded-lg flex flex-col items-center justify-center border transition ${
                  orderStep>=s.step ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-800/50 border-gray-700/30'}`}>
                  <span className="text-lg">{s.icon}</span>
                  <span className={`text-[10px] ${orderStep>=s.step?'text-green-400':'text-gray-500'}`}>{s.label}</span>
                </div>
                {s.step < 3 && (
                  <ArrowRight size={14} className={`flex-shrink-0 ${orderStep>s.step?'text-green-500':'text-gray-600'}`}/>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            <Button onClick={() => {
              if(orderStep===0){setOrderStep(1);setStepMsg('📋 步骤1: 确认订单信息 - 商品: 网络安全课程 × 1, 金额: ¥199');}
              else if(orderStep===1){setOrderStep(2);setStepMsg('💳 步骤2: 跳转到支付页面 - 请完成支付...');}
              else if(orderStep===2){setOrderStep(3);setStepMsg('✅ 步骤3: 支付完成，订单确认！课程已开通');addLog('正常流程: 订单完成');}
              else setStepMsg('🎉 订单已完成');
            }} className="!bg-pink-500 text-white hover:!bg-pink-400">
              <ArrowRight size={16}/> 下一步</Button>
            {orderStep < 3 && (
              <Button variant="outline" onClick={() => {
                if(orderStep<=1){
                  setOrderStep(3);setStepMsg('🚨 漏洞利用成功！直接跳过支付步骤完成了订单！\n📋 订单状态: 已确认 → 跳过支付 → 已完成\n💰 损失: ¥199（未付款）');
                  addLog('步骤绕过: 跳过支付步骤完成订单');
                }else{setStepMsg('已经在后续步骤中');}
              }} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                ⚡ 跳过支付(漏洞利用)</Button>
            )}
            <Button variant="outline" onClick={() => {setOrderStep(0);setStepMsg('');}}
              className="border-gray-600 text-gray-400">重置</Button>
          </div>

          {/* Step progress dots */}
          <div className="flex gap-3 mb-3">
            {[1,2,3].map(s => (
              <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                s<=orderStep?'bg-green-500 text-white':'bg-gray-700 text-gray-500'}`}>{s}</div>
            ))}
          </div>

          {stepMsg && (
            <pre className={`p-3 rounded-lg text-xs whitespace-pre-wrap font-mono border ${
              stepMsg.includes('漏洞') ? 'bg-red-500/10 border-red-500/30 text-red-300' :
              stepMsg.includes('🎉') ? 'bg-green-500/10 border-green-500/30 text-green-300' :
              'bg-blue-500/10 border-blue-500/30 text-blue-300'}`}>
              {stepMsg}
            </pre>
          )}

          <div className="mt-4 p-3 bg-pink-500/5 rounded-lg border border-pink-500/15">
            <p className="text-pink-400 text-xs font-medium mb-2">🛡️ 防御策略</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {[
                '服务端 Session 记录当前步骤状态',
                '每一步提交时校验前置步骤是否已完成',
                '关键步骤（如支付）要求服务端确认',
                '使用状态机模式管理业务流程',
                '支付回调必须验证签名和数据一致性',
              ].map((d,i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-400">
                  <Shield size={12} className="text-pink-400 mt-0.5 flex-shrink-0"/><span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* === Race Condition === */}
        {scenario === 'race' && (<>
          <h3 className="text-pink-400 font-medium mb-1 flex items-center gap-2">
            <Timer size={16}/> 竞态条件演示
          </h3>
          <p className="text-sm text-gray-400 mb-4">并发请求绕过原子操作，在余额检查后、扣款前发起多个提现请求。</p>

          <div className="p-3 bg-black/30 rounded-lg mb-4">
            <p className="text-xs text-gray-500 mb-2">💻 时间线竞争:</p>
            <code className="text-xs text-gray-400 block">T1: 请求A → 检查余额(¥{balance}) ✓</code>
            <code className="text-xs text-gray-400 block">T2: 请求B → 检查余额(¥{balance}) ✓ ← 同时进行!</code>
            <code className="text-xs text-gray-400 block">T3: 请求C → 检查余额(¥{balance}) ✓ ← 第三个并发!</code>
            <code className="text-xs text-red-400 block">T4: 余额扣款 → ¥{balance} - 3×500 = ¥{balance-1500}</code>
            <code className="text-xs text-red-400 block">⚠️ 余额检查与扣款非原子操作!</code>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center min-w-[120px]">
              <p className="text-[11px] text-gray-500">当前余额</p>
              <p className={`text-xl font-mono font-bold ${balance<0?'text-red-400':balance>=1000?'text-green-400':'text-yellow-400'}`}>¥{balance}</p>
            </div>
            <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/30 text-center min-w-[100px]">
              <p className="text-[11px] text-gray-500">攻击次数</p>
              <p className="text-xl font-mono font-bold text-pink-400">{attackCount}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-3 flex-wrap">
            <Button onClick={() => {
              if(balance>=500){
                setTimeout(()=>{setBalance(b=>b-500);setRaceMsg('💰 单次提现 ¥500 已处理');},300);
                setRaceMsg('💰 提现请求已发送：¥500');
              }else{setRaceMsg('❌ 余额不足');}
            }} className="!bg-pink-500 text-white hover:!bg-pink-400">
              💰 正常提现 ¥500</Button>
            <Button onClick={() => {
              if(balance>=500){
                setRaceMsg('⚡ 同时发送3个并发提现请求...\nT1: 检查余额(¥1000) ✓ → 等待扣款\nT2: 检查余额(¥1000) ✓ → 等待扣款\nT3: 检查余额(¥1000) ✓ → 等待扣款');
                setAttackCount(c=>c+1);
                setTimeout(()=>{
                  setBalance(b=>Math.max(-1500,b-1500));
                  setRaceMsg(prev=>prev+'\n\n🚨 竞态条件利用成功！\n3个并发请求在余额检查后依次扣款\n实际扣款: ¥1500 (超过余额 ¥1000)!\n当前余额: ¥-500');
                  addLog('竞态条件: 并发提现成功，超额 ¥500');
                },1200);
              }else{setRaceMsg('❌ 余额不足');}
            }} className="bg-red-600 hover:bg-red-500 text-white">
              <Zap size={14}/> 并发攻击 (×3)</Button>
            <Button onClick={() => {setBalance(1000);setRaceMsg('');setAttackCount(0);}}
              variant="outline" className="border-gray-600 text-gray-400">重置</Button>
          </div>

          {raceMsg && (
            <pre className={`p-3 rounded-lg text-xs whitespace-pre-wrap font-mono border ${
              raceMsg.includes('漏洞')||raceMsg.includes('成功') ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-blue-500/10 border-blue-500/30 text-blue-300'}`}>
              {raceMsg}
            </pre>
          )}

          <div className="mt-4 p-3 bg-pink-500/5 rounded-lg border border-pink-500/15">
            <p className="text-pink-400 text-xs font-medium mb-2">🛡️ 防御策略</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {[
                '使用数据库行锁 (SELECT ... FOR UPDATE)',
                '乐观锁：版本号 + 条件更新',
                '余额检查与扣款放在同一事务中',
                'Redis 分布式锁控制并发',
                'API 限流 + 去重 (幂等性Token)',
              ].map((d,i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-400">
                  <Shield size={12} className="text-pink-400 mt-0.5 flex-shrink-0"/><span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </>)}
      </Card>

      {/* Exploit log */}
      <Card className="border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm text-gray-400 flex items-center gap-2">
            <AlertTriangle size={14} className="text-pink-400"/>
            漏洞利用日志
            {totalExploits > 0 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
                {totalExploits} 次利用
              </span>
            )}
          </h4>
          <button onClick={() => setExploitLog([])}
            className="text-[11px] text-gray-600 hover:text-gray-400 transition">清除</button>
        </div>
        {exploitLog.length === 0 ? (
          <p className="text-xs text-gray-600 py-4 text-center">尝试利用漏洞，记录将显示在此处</p>
        ) : (
          <div className="space-y-1 max-h-[200px] overflow-y-auto">
            {exploitLog.map((l,i) => (
              <div key={i} className="text-xs font-mono text-gray-400 flex items-start gap-2 p-1.5 rounded bg-black/20">
                <span className="text-pink-400">[{i+1}]</span>{l}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
