import { nP, today } from '../utils/helpers';

export default function PeriodFields({ periods, setPeriods }) {
  const update = (id, k, v) => setPeriods(ps => ps.map(p => p.id === id ? { ...p, [k]: v } : p));
  const remove = id => setPeriods(ps => ps.filter(p => p.id !== id));
  const add    = () => setPeriods(ps => [...ps, nP()]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2.5">
        <span style={{ fontSize:12, fontWeight:500, color:'#64748b' }}>
          방문 기간 <span style={{ color:'#ef4444' }}>*</span>
        </span>
        <button onClick={add} style={{ background:'none', border:'0.5px solid #3b82f6', borderRadius:8, padding:'5px 11px', fontSize:11, color:'#3b82f6', cursor:'pointer' }}>
          + 기간 추가
        </button>
      </div>
      {periods.map((p, i) => (
        <div key={p.id} style={{ background:'#f8fafc', border:'0.5px solid #e2e8f0', borderRadius:12, padding:12, marginBottom:10 }}>
          <div className="flex justify-between items-center mb-2.5">
            <span style={{ fontSize:12, fontWeight:500, color:'#64748b' }}>기간 {i+1}</span>
            {periods.length > 1 && (
              <button onClick={() => remove(p.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:11, color:'#f87171' }}>삭제</button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[['시작일','date','s',today()], ['종료일','date','e',''], ['입차','time','f',''], ['출차','time','t','']].map(([label, type, key, min]) => (
              <div key={key}>
                <label style={{ fontSize:10, color:'#94a3b8', display:'block', marginBottom:3 }}>{label}</label>
                <input
                  type={type} value={p[key]} min={min || undefined}
                  onChange={e => update(p.id, key, e.target.value)}
                  style={{ width:'100%', padding:'7px 9px', border:'0.5px solid #e2e8f0', borderRadius:8, fontSize:11, outline:'none', background:'#fff' }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
