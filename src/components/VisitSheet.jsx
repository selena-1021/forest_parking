import { mCar, doCall, getTodayVisits } from '../utils/helpers';

export default function VisitSheet({ visits, onClose }) {
  const list = getTodayVisits(visits);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background:'rgba(0,0,0,.5)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm flex flex-col overflow-hidden" style={{ background:'#fff', borderRadius:'22px 22px 0 0', maxHeight:'92vh' }}>
        <div style={{ width:40, height:4, background:'#e2e8f0', borderRadius:2, margin:'12px auto 0', flexShrink:0 }} />
        <div className="flex items-center justify-between px-5 pt-4 pb-2.5 flex-shrink-0" style={{ borderBottom:'0.5px solid #f1f5f9' }}>
          <span style={{ fontSize:18, fontWeight:500 }}>오늘 방문 현황</span>
          <button onClick={onClose} style={{ background:'#f1f5f9', border:'0.5px solid #e2e8f0', borderRadius:8, width:32, height:32, cursor:'pointer', fontWeight:500, fontSize:15 }}>✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-4">
          {list.length ? list.map(v => {
            const p0 = v.periods[0] || {};
            return (
              <div key={v.id} style={{ border:'0.5px solid #e2e8f0', borderRadius:12, padding:14, marginBottom:10 }}>
                <div style={{ fontSize:15, fontWeight:500, marginBottom:8 }}>
                  {mCar(v.car)}{v.model && <span style={{ fontSize:12, color:'#94a3b8', fontWeight:400 }}> {v.model}</span>}
                </div>
                {[['방문 기간', `${p0.s}~${p0.e}`], ['방문 시간', `${p0.f}–${p0.t}`]].map(([k,vv]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:12, color:'#94a3b8' }}>{k}</span>
                    <span style={{ fontSize:12 }}>{vv}</span>
                  </div>
                ))}
                <button onClick={() => doCall(v.phone)}
                  style={{ marginTop:10, width:'100%', padding:10, borderRadius:10, border:'0.5px solid #86efac', background:'#f0fdf4', color:'#15803d', fontSize:13, fontWeight:500, cursor:'pointer' }}>
                  📞 차주에게 전화하기
                </button>
              </div>
            );
          }) : (
            <p style={{ textAlign:'center', padding:'28px 0', color:'#94a3b8', fontSize:13 }}>오늘 예정된 방문 차량이 없어요</p>
          )}
        </div>

        <div className="flex-shrink-0 px-5 pb-10 pt-3" style={{ borderTop:'0.5px solid #f1f5f9' }}>
          <div style={{ background:'#f8fafc', borderRadius:10, padding:'11px 13px' }}>
            <p style={{ fontSize:12, color:'#64748b', lineHeight:1.75 }}>· 개인정보 보호를 위해 연락처는 직접 노출되지 않습니다.</p>
            <p style={{ fontSize:12, color:'#64748b', lineHeight:1.75 }}>· 전화하기 버튼을 누르면 차주와 통화할 수 있습니다. (고객님의 전화번호가 차주에게 표시되니 유의해 주세요.)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
