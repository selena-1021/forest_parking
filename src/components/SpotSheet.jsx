import { SPOT_TYPE, SC } from '../data/store';
import { mCar, mPhone, doCall } from '../utils/helpers';

const TYPE_LABEL = { c:'경차전용', e:'전기차전용', g:'일반' };
const TYPE_STYLE = {
  c:{ bg:'#fef3c7', color:'#92400e' },
  e:{ bg:'#d1fae5', color:'#065f46' },
  g:{ bg:'#dbeafe', color:'#1e3a8a' },
};

export default function SpotSheet({ spotId, state, onClose }) {
  if (!spotId) return null;
  const t    = SPOT_TYPE[spotId];
  const info = state.asgn[spotId] || { unit:'', carId:'' };
  const u    = info.unit || '';
  const unitRes = u ? state.res[u] : null;
  const cars = unitRes?.cars || [];
  const car  = info.carId ? (cars.find(c=>c.id===info.carId)||null) : null;
  const isMe = u === state.me;
  const ts   = TYPE_STYLE[t];

  const carDisplay = isMe ? (car?.car||'') : (car ? mCar(car.car) : '');

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'flex-end', justifyContent:'center', background:'rgba(0,0,0,.5)' }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ width:'100%', maxWidth:390, background:'#fff', borderRadius:'22px 22px 0 0', minHeight:'50vh', maxHeight:'92vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ width:40, height:4, background:'#e2e8f0', borderRadius:2, margin:'12px auto 0', flexShrink:0 }} />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px 4px', flexShrink:0, borderBottom:'0.5px solid #f1f5f9' }}>
          <span style={{ fontSize:18, fontWeight:500 }}>{spotId}면</span>
          <button onClick={onClose} style={{ background:'#f1f5f9', border:'0.5px solid #e2e8f0', borderRadius:8, width:32, height:32, cursor:'pointer', fontWeight:500, fontSize:15 }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'18px 18px 36px' }}>
          {/* 주차면 타입 태그 (바텀시트에서는 표시) */}
          <span style={{ display:'inline-block', fontSize:12, fontWeight:500, padding:'3px 11px', borderRadius:20, marginBottom:16, background:ts.bg, color:ts.color }}>
            {TYPE_LABEL[t]}
          </span>

          {u && car ? (
            <>
              <div style={{ background:'#f8fafc', border:'0.5px solid #e2e8f0', borderRadius:12, overflow:'hidden', marginBottom:16 }}>
                {[
                  ['호수', `${u}호`],
                  ['차량번호', carDisplay || '미입력'],
                  ...(car.model ? [['차량 모델', car.model]] : []),
                  ...(isMe && car.phone ? [['연락처', mPhone(car.phone)]] : []),
                ].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 16px', borderBottom:'0.5px solid #f1f5f9' }}>
                    <span style={{ fontSize:13, color:'#64748b' }}>{k}</span>
                    <span style={{ fontSize:14, fontWeight:500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:'#eff6ff', borderRadius:10, padding:'11px 13px', marginBottom:18 }}>
                <p style={{ fontSize:12, color:'#3b82f6', lineHeight:1.75 }}>· 개인정보 보호를 위해 연락처는 직접 노출되지 않습니다.</p>
                <p style={{ fontSize:12, color:'#3b82f6', lineHeight:1.75 }}>· 전화하기 버튼을 누르면 차주와 통화할 수 있습니다. (고객님의 전화번호가 차주에게 표시되니 유의해 주세요.)</p>
              </div>
              {car.phone && (
                <button onClick={() => doCall(car.phone)}
                  style={{ width:'100%', padding:14, borderRadius:10, border:'0.5px solid #86efac', background:'#f0fdf4', color:'#15803d', fontSize:14, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  📞 차주에게 전화하기
                </button>
              )}
            </>
          ) : u && !car ? (
            /* 호수는 배정됐지만 차량이 아직 미등록 */
            <div style={{ background:'#f8fafc', border:'0.5px solid #e2e8f0', borderRadius:12, overflow:'hidden' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 16px' }}>
                <span style={{ fontSize:13, color:'#64748b' }}>호수</span>
                <span style={{ fontSize:14, fontWeight:500 }}>{u}호</span>
              </div>
              <div style={{ padding:'12px 16px', borderTop:'0.5px solid #f1f5f9', background:'#fffbeb' }}>
                <p style={{ fontSize:13, color:'#92400e' }}>차량 정보가 아직 등록되지 않았어요.</p>
                <p style={{ fontSize:11, color:'#a16207', marginTop:4, lineHeight:1.6 }}>거주자가 내 정보에서 차량을 등록하거나,<br/>관리자가 주차면 배정에서 차량을 선택해 주세요.</p>
              </div>
            </div>
          ) : (
            <p style={{ fontSize:14, color:'#94a3b8' }}>미배정 주차면입니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
