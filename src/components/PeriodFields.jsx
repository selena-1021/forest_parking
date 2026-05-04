import { nP, today } from '../utils/helpers';

export default function PeriodFields({ periods, setPeriods }) {
  const update = (id, k, v) => setPeriods(ps => ps.map(p => p.id === id ? { ...p, [k]: v } : p));
  const remove = id => setPeriods(ps => ps.filter(p => p.id !== id));
  const add    = () => setPeriods(ps => [...ps, nP()]);

  const inputStyle = {
    width:'100%', padding:'8px 10px',
    border:'0.5px solid #e2e8f0', borderRadius:8,
    fontSize:12, outline:'none', background:'#fff',
    color:'#1e293b', fontFamily:'var(--font-sans)',
    boxSizing:'border-box',
  };

  return (
    <div style={{ marginBottom:4 }}>
      {/* 헤더 */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <span style={{ fontSize:12, fontWeight:500, color:'#64748b' }}>
          방문 기간 <span style={{ color:'#ef4444' }}>*</span>
        </span>
        <button onClick={add}
          style={{ background:'none', border:'0.5px solid #3b82f6', borderRadius:8, padding:'5px 11px', fontSize:11, color:'#3b82f6', cursor:'pointer', fontFamily:'var(--font-sans)' }}>
          + 기간 추가
        </button>
      </div>

      {periods.map((p, i) => (
        <div key={p.id} style={{ background:'#f8fafc', border:'0.5px solid #e2e8f0', borderRadius:12, padding:14, marginBottom:10 }}>
          {/* 기간 헤더 */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <span style={{ fontSize:12, fontWeight:500, color:'#64748b' }}>기간 {i+1}</span>
            {periods.length > 1 && (
              <button onClick={() => remove(p.id)}
                style={{ background:'none', border:'none', cursor:'pointer', fontSize:11, color:'#f87171', fontFamily:'var(--font-sans)' }}>삭제</button>
            )}
          </div>

          {/* 날짜 행 */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
            <div>
              <label style={{ fontSize:11, color:'#94a3b8', display:'block', marginBottom:4 }}>시작일</label>
              <input type="date" value={p.s} min={today()}
                onChange={e => update(p.id, 's', e.target.value)}
                style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize:11, color:'#94a3b8', display:'block', marginBottom:4 }}>종료일</label>
              <input type="date" value={p.e}
                onChange={e => update(p.id, 'e', e.target.value)}
                style={inputStyle} />
            </div>
          </div>

          {/* 시간 행 */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div>
              <label style={{ fontSize:11, color:'#94a3b8', display:'block', marginBottom:4 }}>입차 시간</label>
              <input type="time" value={p.f}
                onChange={e => update(p.id, 'f', e.target.value)}
                style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize:11, color:'#94a3b8', display:'block', marginBottom:4 }}>출차 시간</label>
              <input type="time" value={p.t}
                onChange={e => update(p.id, 't', e.target.value)}
                style={inputStyle} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
