import { useState, useEffect, useRef } from 'react';
import { UNITS_DEF, QR_CFGS, BASE, newCar } from '../data/store';
import { mCar, nP, today, doCall, getTodayVisits, drawQRCanvas, filterValidVisits } from '../utils/helpers';
import PeriodFields from '../components/PeriodFields';
import ConsentBox from '../components/ConsentBox';

/* ─── 공통 스타일 ─── */
function Field({ label, required, error, children }) {
  return (
    <div style={{ marginBottom:12 }}>
      <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#475569', marginBottom:5 }}>
        {label}{required && <span style={{ color:'#ef4444', marginLeft:2 }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize:11, color:'#ef4444', marginTop:3 }}>{error}</p>}
    </div>
  );
}
const INP = (err) => ({
  width:'100%', padding:'10px 12px',
  border:`0.5px solid ${err?'#f87171':'#e2e8f0'}`,
  borderRadius:10, fontSize:13, outline:'none', background:'#fff',
});
const SEL = { ...INP(), background:'#fff' };
const BTN = (active) => ({
  width:'100%', padding:12, borderRadius:10, cursor:'pointer', fontSize:13, fontWeight:500,
  border: active?'0.5px solid #86efac':'none',
  background: active?'#f0fdf4':'#3b82f6',
  color: active?'#15803d':'#fff',
});

/* ─── LoginPage ─── */
export function LoginPage({ state, dispatch }) {
  const [unit, setUnit] = useState('');
  const [pw, setPw]     = useState('');
  const [err, setErr]   = useState('');
  const [show, setShow] = useState(false);

  const login = () => {
    if (!unit) { setErr('호수를 선택해주세요'); return; }
    if (pw !== state.pw) { setErr('비밀번호가 올바르지 않습니다'); return; }
    dispatch({ type:'LOGIN', unit });
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:360, background:'#fff', borderRadius:24, padding:28, border:'0.5px solid #e2e8f0' }}>
        <div style={{ width:52, height:52, background:'#dbeafe', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:24 }}>🚗</div>
        <div style={{ textAlign:'center', marginBottom:22 }}>
          <h2 style={{ fontSize:18, fontWeight:500 }}>{state.title}</h2>
          <p style={{ fontSize:12, color:'#94a3b8', marginTop:4 }}>주차 관리 시스템</p>
        </div>
        <Field label="호수">
          <select value={unit} onChange={e=>{ setUnit(e.target.value); setErr(''); }} style={SEL}>
            <option value="">선택하세요</option>
            {UNITS_DEF.map(u=><option key={u} value={u}>{u}호{state.admins.includes(u)?' (관리자)':''}</option>)}
          </select>
        </Field>
        <Field label="공용 비밀번호">
          <div style={{ position:'relative' }}>
            <input type={show?'text':'password'} value={pw} maxLength={4}
              onChange={e=>{ setPw(e.target.value.replace(/\D/g,'')); setErr(''); }}
              onKeyDown={e=>e.key==='Enter'&&login()}
              placeholder="••••" style={{ ...INP(), fontSize:20, letterSpacing:8, paddingRight:52 }} />
            <button onClick={()=>setShow(s=>!s)}
              style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:11, color:'#94a3b8' }}>
              {show?'숨기기':'보기'}
            </button>
          </div>
        </Field>
        {err && <p style={{ fontSize:11, color:'#ef4444', marginBottom:10 }}>{err}</p>}
        <button onClick={login} style={BTN(false)}>입장하기</button>
        <div style={{ textAlign:'center', marginTop:10 }}>
          <button onClick={()=>dispatch({type:'GOTO',page:'visitor-form',vfHost:''})}
            style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'#64748b', textDecoration:'underline' }}>
            방문자이신가요? 차량 등록하기
          </button>
        </div>
        <div style={{ marginTop:12, padding:'10px 12px', background:'#f8fafc', borderRadius:10, border:'0.5px solid #e2e8f0' }}>
          <p style={{ fontSize:11, color:'#64748b', lineHeight:1.7 }}>· 비밀번호는 관리자에게 문의해 주세요.</p>
          <p style={{ fontSize:11, color:'#64748b', lineHeight:1.7 }}>· 개인정보 일부는 별표(*)로 가려져서 표시돼요.</p>
        </div>
        <p style={{ textAlign:'center', marginTop:12, fontSize:11, color:'#cbd5e1', fontStyle:'italic' }}>Created by Selena for my parents</p>
      </div>
    </div>
  );
}

/* ─── VisitorFormPage ─── */
export function VisitorFormPage({ state, dispatch }) {
  const [host, setHost]   = useState(state.vfHost||'');
  const [car, setCar]     = useState('');
  const [model, setModel] = useState('');
  const [phone, setPhone] = useState('');
  const [periods, setPeriods] = useState([nP()]);
  const [errs, setErrs]   = useState({});
  const [done, setDone]   = useState(false);
  const [agreed, setAgreed] = useState(false);
  const fixed = !!state.vfHost;

  const submit = () => {
    const e = {};
    if (!host)  e.host  = '방문 호수를 선택해주세요';
    if (!car)   e.car   = '차량번호를 입력해주세요';
    if (!phone) e.phone = '연락처를 입력해주세요';
    if (Object.keys(e).length) { setErrs(e); return; }
    dispatch({ type:'ADD_VISIT', visit:{ id:Date.now(), host, car, model, phone, periods:[...periods] } });
    setDone(true);
  };

  if (done) return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:360, background:'#fff', borderRadius:24, padding:32, textAlign:'center', border:'0.5px solid #e2e8f0' }}>
        <div style={{ width:64, height:64, background:'#dcfce7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:28 }}>✓</div>
        <h2 style={{ fontSize:17, fontWeight:500, marginBottom:8 }}>등록이 완료되었습니다!</h2>
        <p style={{ fontSize:13, color:'#64748b', lineHeight:1.7, marginBottom:24 }}>거주자가 확인 후 연락드릴 예정입니다.</p>
        <button onClick={()=>state.in?dispatch({type:'GOTO',page:'map'}):setDone(false)} style={BTN(false)}>
          {state.in?'메인으로 이동':'새 방문 등록'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'24px 20px 40px' }}>
      <div style={{ width:'100%', maxWidth:390, background:'#fff', borderRadius:24, padding:28, border:'0.5px solid #e2e8f0' }}>
        <div style={{ textAlign:'center', marginBottom:22 }}>
          <div style={{ fontSize:28, marginBottom:10 }}>👥</div>
          <h2 style={{ fontSize:18, fontWeight:500 }}>{state.title} 방문 등록</h2>
          <p style={{ fontSize:12, color:'#94a3b8', marginTop:4 }}>방문 차량 정보를 입력해 주세요</p>
        </div>
        {fixed
          ? <Field label="방문 호수"><input value={`${host}호`} readOnly style={{ ...INP(), background:'#f8fafc', color:'#94a3b8', cursor:'not-allowed' }} /></Field>
          : <Field label="방문 호수" required error={errs.host}>
              <select value={host} onChange={e=>{setHost(e.target.value);setErrs(p=>({...p,host:''}));}} style={SEL}>
                <option value="">선택하세요</option>
                {UNITS_DEF.map(u=><option key={u} value={u}>{u}호</option>)}
              </select>
            </Field>
        }
        <Field label="차량번호" required error={errs.car}>
          <input value={car} onChange={e=>{setCar(e.target.value);setErrs(p=>({...p,car:''}));}} placeholder="12가3456" style={INP(errs.car)} />
        </Field>
        <Field label="차량 모델">
          <input value={model} onChange={e=>setModel(e.target.value)} placeholder="예: 아반떼" style={INP()} />
        </Field>
        <Field label="연락처" required error={errs.phone}>
          <input type="tel" value={phone} onChange={e=>{setPhone(e.target.value);setErrs(p=>({...p,phone:''}));}} placeholder="010-0000-0000" style={INP(errs.phone)} />
        </Field>
        <PeriodFields periods={periods} setPeriods={setPeriods} />
        <ConsentBox type="B" checked={agreed} onChange={setAgreed} />
        <button onClick={submit}
          style={{ ...BTN(false), marginTop:0, background: agreed ? '#3b82f6' : '#e2e8f0', color: agreed ? '#fff' : '#94a3b8', cursor: agreed ? 'pointer' : 'not-allowed' }}
          disabled={!agreed}>예약 등록하기</button>
        <div style={{ marginTop:14, padding:'10px 12px', background:'#f8fafc', borderRadius:10, border:'0.5px solid #e2e8f0' }}>
          <p style={{ fontSize:11, color:'#64748b', lineHeight:1.7 }}>· 원활한 주차 관리를 위해 방문 정보를 등록해 주세요.</p>
          <p style={{ fontSize:11, color:'#64748b', lineHeight:1.7 }}>· 차량번호와 연락처 일부는 별표(*)로 가려져 표시됩니다.</p>
        </div>
        <div style={{ textAlign:'center', marginTop:14 }}>
          <button onClick={()=>dispatch({type:'GOTO',page:state.in?'map':'login'})}
            style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'#94a3b8' }}>
            ← {state.in?'메인으로':'로그인 화면으로'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MyInfoPage: 차량 N대 관리 ─── */
export function MyInfoPage({ state, dispatch }) {
  const unitData = state.res[state.me] || { cars:[newCar()] };
  const [cars, setCars] = useState(() => unitData.cars.length ? unitData.cars : [newCar()]);
  const [agreed, setAgreed] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateCar = (id, field, value) =>
    setCars(prev => prev.map(c => c.id===id ? {...c, [field]:value} : c));
  const addCar    = () => setCars(prev => [...prev, newCar()]);
  const removeCar = (id) => { if (cars.length <= 1) return; setCars(prev => prev.filter(c => c.id !== id)); };

  const save = () => {
    if (!agreed) return;
    dispatch({ type:'UPDATE_CARS', unit:state.me, cars });
    setSaved(true); setTimeout(()=>setSaved(false), 2000);
  };

  return (
    <div style={{ padding:'16px 14px 0' }}>
      <h2 style={{ fontSize:15, fontWeight:500, marginBottom:3 }}>내 정보</h2>
      <p style={{ fontSize:11, color:'#94a3b8', marginBottom:16, lineHeight:1.6 }}>차량 정보와 연락처를 수정할 수 있습니다. 차량이 여러 대면 추가해 주세요.</p>

      {cars.map((car, idx) => (
        <div key={car.id} style={{ background:'#f8fafc', border:'0.5px solid #e2e8f0', borderRadius:12, padding:14, marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <span style={{ fontSize:13, fontWeight:500, color:'#374151' }}>차량 {idx+1}</span>
            {cars.length > 1 && (
              <button onClick={()=>removeCar(car.id)}
                style={{ background:'none', border:'0.5px solid #fca5a5', borderRadius:8, padding:'3px 10px', fontSize:11, color:'#ef4444', cursor:'pointer' }}>삭제</button>
            )}
          </div>
          <Field label="차량번호"><input value={car.car} onChange={e=>updateCar(car.id,'car',e.target.value)} placeholder="12가3456" style={INP()} /></Field>
          <Field label="차량 모델"><input value={car.model} onChange={e=>updateCar(car.id,'model',e.target.value)} placeholder="예: 제네시스" style={INP()} /></Field>
          <Field label="연락처"><input type="tel" value={car.phone} onChange={e=>updateCar(car.id,'phone',e.target.value)} placeholder="010-0000-0000" style={INP()} /></Field>
        </div>
      ))}

      <button onClick={addCar}
        style={{ width:'100%', padding:'10px', borderRadius:10, border:'0.5px dashed #93c5fd', background:'#eff6ff', color:'#3b82f6', fontSize:13, fontWeight:500, cursor:'pointer', marginBottom:12 }}>
        + 차량 추가
      </button>

      <ConsentBox type="A" checked={agreed} onChange={setAgreed} />

      <button onClick={save}
        style={{ ...BTN(saved), background: saved ? '#f0fdf4' : agreed ? '#3b82f6' : '#e2e8f0', color: saved ? '#15803d' : agreed ? '#fff' : '#94a3b8', cursor: agreed ? 'pointer' : 'not-allowed' }}
        disabled={!agreed}>
        {saved ? '✓ 저장됨' : '저장하기'}
      </button>
    </div>
  );
}

/* ─── VisitorsPage ─── */
export function VisitorsPage({ state, dispatch }) {
  const [car, setCar]     = useState('');
  const [model, setModel] = useState('');
  const [phone, setPhone] = useState('');
  const [periods, setPeriods] = useState([nP()]);
  const [errs, setErrs]   = useState({});
  const [saved, setSaved] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const my = filterValidVisits(state.visits.filter(v=>v.host===state.me));
  const vLink = `${BASE}/visit?host=${state.me}`;

  const submit = () => {
    const e = {};
    if (!car)   e.car   = '차량번호를 입력해주세요';
    if (!phone) e.phone = '연락처를 입력해주세요';
    if (!agreed) return;
    if (Object.keys(e).length) { setErrs(e); return; }
    dispatch({ type:'ADD_VISIT', visit:{ id:Date.now(), host:state.me, car, model, phone, periods:[...periods] } });
    setCar(''); setModel(''); setPhone(''); setPeriods([nP()]); setErrs({}); setAgreed(false);
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  };

  return (
    <div style={{ padding:'16px 14px 0' }}>
      <h2 style={{ fontSize:15, fontWeight:500, marginBottom:3 }}>방문자 관리</h2>
      <p style={{ fontSize:11, color:'#94a3b8', marginBottom:16, lineHeight:1.6 }}>링크를 공유해 방문자가 직접 입력하거나, 아래에서 직접 등록하세요.</p>

      <div style={{ background:'#f8fafc', border:'0.5px solid #e2e8f0', borderRadius:12, padding:'12px 14px', marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
        <div style={{ minWidth:0, flex:1 }}>
          <div style={{ fontSize:12, fontWeight:500, marginBottom:2 }}>방문자 등록 링크 ({state.me}호)</div>
          <div style={{ fontSize:10, color:'#94a3b8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{vLink}</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:5, flexShrink:0 }}>
          <button onClick={()=>navigator.clipboard?.writeText(vLink)}
            style={{ padding:'6px 10px', borderRadius:8, border:'0.5px solid #3b82f6', background:'#dbeafe', color:'#1d4ed8', fontSize:11, fontWeight:500, cursor:'pointer' }}>링크 복사</button>
          <button onClick={()=>dispatch({type:'GOTO',page:'visitor-form',vfHost:state.me})}
            style={{ padding:'6px 10px', borderRadius:8, border:'0.5px solid #e2e8f0', background:'transparent', color:'#64748b', fontSize:11, fontWeight:500, cursor:'pointer' }}>폼 열기</button>
        </div>
      </div>

      <Field label="차량번호" required error={errs.car}>
        <input value={car} onChange={e=>{setCar(e.target.value);setErrs(p=>({...p,car:''}));}} placeholder="12가3456" style={INP(errs.car)} />
      </Field>
      <Field label="차량 모델">
        <input value={model} onChange={e=>setModel(e.target.value)} placeholder="예: 아반떼" style={INP()} />
      </Field>
      <Field label="연락처" required error={errs.phone}>
        <input type="tel" value={phone} onChange={e=>{setPhone(e.target.value);setErrs(p=>({...p,phone:''}));}} placeholder="010-0000-0000" style={INP(errs.phone)} />
      </Field>
      <PeriodFields periods={periods} setPeriods={setPeriods} />
      <ConsentBox type="C" checked={agreed} onChange={setAgreed} />
      <button onClick={submit}
        style={{ ...BTN(saved), marginTop:0, background: saved?'#f0fdf4': agreed?'#3b82f6':'#e2e8f0', color: saved?'#15803d': agreed?'#fff':'#94a3b8', cursor: agreed?'pointer':'not-allowed' }}
        disabled={!agreed}>
        {saved?'✓ 등록 완료':'예약 등록하기'}
      </button>

      {my.length > 0 && (
        <div style={{ marginTop:22, borderTop:'0.5px solid #f1f5f9', paddingTop:14 }}>
          <p style={{ fontSize:13, fontWeight:500, marginBottom:10 }}>등록한 방문 목록</p>
          {my.map(v=>(
            <div key={v.id} style={{ background:'#f8fafc', border:'0.5px solid #e2e8f0', borderRadius:12, padding:'11px 13px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:500, marginBottom:3 }}>
                  {mCar(v.car)}{v.model&&<span style={{ fontSize:11, color:'#94a3b8', fontWeight:400 }}> {v.model}</span>}
                </div>
                {(v.periods||[]).map(p=>(
                  <div key={p.id} style={{ fontSize:11, color:'#94a3b8' }}>{p.s}~{p.e} ({p.f}–{p.t})</div>
                ))}
              </div>
              <button onClick={()=>{ if(window.confirm('이 방문 예약을 삭제하시겠어요?')) dispatch({type:'DEL_VISIT',id:v.id}); }}
                style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', padding:'2px', flexShrink:0 }}>🗑</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── AdminPage ─── */
export function AdminPage({ state, dispatch }) {
  const [tab, setTab] = useState('spots');
  return (
    <div style={{ padding:'16px 14px 0' }}>
      <h2 style={{ fontSize:15, fontWeight:500, marginBottom:14 }}>주차장 관리</h2>
      <div style={{ display:'flex', background:'#f1f5f9', borderRadius:10, padding:3, gap:3, marginBottom:16 }}>
        {[['spots','주차면'],['qr','공용 QR'],['settings','건물 설정']].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            style={{ flex:1, padding:'7px 4px', fontSize:12, fontWeight:500, border:tab===k?'0.5px solid #e2e8f0':'none', cursor:'pointer', borderRadius:8, background:tab===k?'#fff':'transparent', color:tab===k?'#2563eb':'#94a3b8' }}>
            {l}
          </button>
        ))}
      </div>
      {tab==='spots'    && <AdminSpots    state={state} dispatch={dispatch} />}
      {tab==='qr'       && <AdminQR       state={state} />}
      {tab==='settings' && <AdminSettings state={state} dispatch={dispatch} />}
    </div>
  );
}

/* ─── AdminSpots: 주차면 배정 (호수 + 차량 선택) ─── */
function AdminSpots({ state, dispatch }) {
  const [spotId, setSpotId] = useState('01');
  const [unit, setUnit]     = useState('');
  const [carId, setCarId]   = useState('');
  const [saved, setSaved]   = useState(false);

  // 면 선택 시 현재 배정값 로드
  useEffect(() => {
    const info = state.asgn[spotId] || { unit:'', carId:'' };
    setUnit(info.unit||'');
    setCarId(info.carId||'');
    setSaved(false);
  }, [spotId]);

  // 호수 변경 시 carId 초기화 + 첫 번째 차 자동 선택
  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    setSaved(false);
    if (newUnit) {
      const cars = state.res[newUnit]?.cars || [];
      setCarId(cars[0]?.id || '');
    } else {
      setCarId('');
    }
  };

  const cars = unit ? (state.res[unit]?.cars || []) : [];
  const selectedCar = cars.find(c=>c.id===carId) || cars[0];
  const res = selectedCar || {};

  const save = () => {
    dispatch({ type:'SET_ASGN', spotId, unit, carId: unit ? (carId || cars[0]?.id || '') : '' });
    setSaved(true); setTimeout(()=>setSaved(false), 2000);
  };

  const SPOT_TYPE_LABEL = (id) => ({ '10':'(경차전용)', '12':'(전기차전용)' }[id]||'');

  return (
    <>
      <Field label="주차면 선택">
        <select value={spotId} onChange={e=>setSpotId(e.target.value)} style={SEL}>
          {['01','02','03','04','05','06','07','08','09','10','11','12','13'].map(id=>(
            <option key={id} value={id}>{id}면 {SPOT_TYPE_LABEL(id)}</option>
          ))}
        </select>
      </Field>

      <div style={{ background:'#f8fafc', border:'0.5px solid #e2e8f0', borderRadius:12, padding:14, marginBottom:14 }}>
        <Field label="배정 호수">
          <select value={unit} onChange={e=>handleUnitChange(e.target.value)} style={SEL}>
            <option value="">없음 (빈자리)</option>
            {UNITS_DEF.map(u=><option key={u} value={u}>{u}호</option>)}
          </select>
        </Field>

        {/* 호수 선택 시 차량 선택 드롭다운 */}
        {unit && cars.length > 0 && (
          <Field label="배정 차량">
            <select value={carId} onChange={e=>setCarId(e.target.value)} style={SEL}>
              {cars.map((c,i)=>(
                <option key={c.id} value={c.id}>
                  차량 {i+1} {c.car ? `(${c.car})` : '(번호 미입력)'}{c.model ? ` - ${c.model}` : ''}
                </option>
              ))}
            </select>
          </Field>
        )}

        {/* 선택된 차량 정보 미리보기 (읽기 전용) */}
        {unit && (
          <div style={{ background:'#f1f5f9', borderRadius:8, padding:'10px 12px', marginTop:4 }}>
            <p style={{ fontSize:11, color:'#64748b', marginBottom:8 }}>거주자가 "내 정보"에서 직접 수정합니다.</p>
            {[['차량번호', res.car],['차량 모델', res.model],['연락처', res.phone]].map(([label,val])=>(
              <div key={label} style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:12, color:'#64748b' }}>{label}</span>
                <span style={{ fontSize:12, color:val?'#374151':'#cbd5e1', fontWeight:500 }}>{val||'미입력'}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={save} style={{ ...BTN(saved), marginTop:12 }}>
          {saved?'✓ 저장됨':'저장하기'}
        </button>
      </div>

      <div style={{ background:'#fef9c3', border:'0.5px solid #fde68a', borderRadius:12, padding:14 }}>
        <h3 style={{ fontSize:13, fontWeight:500, color:'#92400e', marginBottom:8 }}>주차면 자동배정</h3>
        <p style={{ fontSize:11, color:'#a16207', lineHeight:1.8 }}>
          · 매월 1일 00시에 주차면이 순차적으로 자동 변경됩니다. (예: 01 → 02)<br/>
          · 경차(10면)와 전기차(12면) 주차면은 변경되지 않는 고정석입니다.<br/>
          · 자동 변경이 되지 않은 경우, 주차면별로 직접 설정해 주세요.
        </p>
      </div>
    </>
  );
}

/* ─── AdminQR ─── */
function AdminQR({ state }) {
  const refs = { main:useRef(), visitor:useRef() };
  useEffect(()=>{ QR_CFGS.forEach(cfg=>drawQRCanvas(refs[cfg.key].current, cfg.url)); }, []);

  return (
    <>
      <p style={{ fontSize:11, color:'#94a3b8', lineHeight:1.6, marginBottom:14 }}>아래 QR을 인쇄해 공용 게시판에 부착하세요.</p>
      {QR_CFGS.map(cfg=>(
        <div key={cfg.key} style={{ border:'0.5px solid #e2e8f0', borderRadius:12, overflow:'hidden', marginBottom:14 }}>
          <div style={{ padding:'12px 14px 10px', borderBottom:'0.5px solid #f1f5f9' }}>
            <h3 style={{ fontSize:13, fontWeight:500, marginBottom:3 }}>{cfg.label}</h3>
            <p style={{ fontSize:11, color:'#94a3b8', lineHeight:1.5 }}>{cfg.desc}</p>
          </div>
          <div style={{ padding:18, display:'flex', flexDirection:'column', alignItems:'center', gap:8, background:'#f8fafc' }}>
            <div style={{ background:'#fff', padding:9, borderRadius:8 }}>
              <canvas ref={refs[cfg.key]} width={160} height={160} />
            </div>
            <div style={{ fontSize:12, fontWeight:500 }}>{cfg.guide}</div>
            <div style={{ fontSize:10, color:'#94a3b8' }}>{cfg.url}</div>
          </div>
          <div style={{ display:'flex', gap:8, padding:'10px 14px', borderTop:'0.5px solid #f1f5f9' }}>
            <button onClick={()=>navigator.clipboard?.writeText(cfg.url)}
              style={{ flex:1, padding:9, borderRadius:8, border:'0.5px solid #e2e8f0', background:'transparent', fontSize:12, fontWeight:500, cursor:'pointer' }}>링크 복사</button>
            <button onClick={()=>{
              const img=refs[cfg.key].current?.toDataURL();
              const w=window.open('','_blank');
              w?.document.write(`<html><body style="text-align:center;padding:40px"><h2>${cfg.label}</h2><img src="${img}" style="width:200px"><p>${cfg.guide}</p><script>window.print()<\/script></body></html>`);
            }} style={{ flex:1, padding:9, borderRadius:8, border:'0.5px solid #3b82f6', background:'#dbeafe', color:'#1d4ed8', fontSize:12, fontWeight:500, cursor:'pointer' }}>인쇄</button>
          </div>
        </div>
      ))}
    </>
  );
}

/* ─── AdminSettings ─── */
function AdminSettings({ state, dispatch }) {
  const [title, setTitle] = useState(state.title);
  const [pw, setPw]       = useState('');
  const [newAdmin, setNewAdmin] = useState('');
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (pw.length>0 && pw.length!==4) { alert('비밀번호는 숫자 4자리여야 합니다.'); return; }
    dispatch({ type:'SETTINGS', title, pw:pw.length===4?pw:state.pw });
    setSaved(true); setTimeout(()=>setSaved(false), 2000);
  };

  const nonAdmins = UNITS_DEF.filter(u=>!state.admins.includes(u));

  return (
    <>
      <div style={{ background:'#f8fafc', border:'0.5px solid #e2e8f0', borderRadius:12, padding:16, marginBottom:14 }}>
        <Field label="건물 이름"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="우리빌라" style={INP()} /></Field>
        <Field label="공용 비밀번호 (숫자 4자리)">
          <input type="password" value={pw} maxLength={4} onChange={e=>setPw(e.target.value.replace(/\D/g,''))}
            placeholder="변경할 경우 입력" style={{ ...INP(), fontSize:18, letterSpacing:6, textAlign:'center' }} />
        </Field>
        <div>
          <label style={{ fontSize:12, fontWeight:500, color:'#475569', display:'block', marginBottom:8 }}>관리자 설정</label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:10 }}>
            {state.admins.map(u=>(
              <div key={u} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 10px 5px 12px', background:'#dbeafe', borderRadius:20 }}>
                <span style={{ fontSize:12, fontWeight:500, color:'#1d4ed8' }}>{u}호</span>
                {state.admins.length>1
                  ? <button onClick={()=>dispatch({type:'REVOKE_ADMIN',unit:u})} style={{ background:'none', border:'none', cursor:'pointer', color:'#1d4ed8', fontSize:13 }}>✕</button>
                  : <span style={{ fontSize:10, opacity:.6, color:'#1d4ed8' }}>최소1명</span>}
              </div>
            ))}
          </div>
          {nonAdmins.length>0 && (
            <div style={{ display:'flex', gap:8 }}>
              <select value={newAdmin} onChange={e=>setNewAdmin(e.target.value)} style={{ ...SEL, flex:1, fontSize:12, padding:'8px 10px' }}>
                <option value="">호수 선택</option>
                {nonAdmins.map(u=><option key={u} value={u}>{u}호</option>)}
              </select>
              <button onClick={()=>{if(newAdmin){dispatch({type:'ADD_ADMIN',unit:newAdmin});setNewAdmin('');}}}
                style={{ padding:'8px 14px', borderRadius:8, border:'0.5px solid #3b82f6', background:'#dbeafe', color:'#1d4ed8', fontSize:12, fontWeight:500, cursor:'pointer', whiteSpace:'nowrap' }}>추가하기</button>
            </div>
          )}
        </div>
      </div>
      <button onClick={save} style={{ ...BTN(saved), marginBottom:14 }}>
        {saved?'✓ 저장됨':'변경사항 저장'}
      </button>
      <div style={{ padding:'0 2px' }}>
        <p style={{ fontSize:11, color:'#94a3b8', lineHeight:1.8 }}>· 비밀번호를 변경한 후, 접속이 필요한 거주자에게 공유해주세요.</p>
        <p style={{ fontSize:11, color:'#94a3b8', lineHeight:1.8 }}>· 관리자는 주차장 관리 메뉴에 접근할 수 있습니다.</p>
        <p style={{ fontSize:11, color:'#94a3b8', lineHeight:1.8 }}>· 관리자는 여러 명 추가할 수 있습니다. (최소 1명 설정)</p>
      </div>
    </>
  );
}
