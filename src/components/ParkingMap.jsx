import { SPOT_IDS, SPOT_TYPE, SC, BLDG, spotPos } from '../data/store';
import { mCar } from '../utils/helpers';

export default function ParkingMap({ state, onSpotClick }) {
  const { asgn, res, me } = state;

  return (
    <div className="relative overflow-hidden flex-shrink-0 mt-2.5" style={{ height: 460, background: 'var(--map-bg, #f1f5f9)' }}>
      {/* 건물 */}
      <div className="absolute border rounded top-0 right-0" style={{ left:`${BLDG}%`, width:`${100-BLDG-1}%`, height:'90%', background:'#fff', borderColor:'#cbd5e1' }} />
      {/* 도로 */}
      <div className="absolute bottom-0 left-0 right-0 opacity-35" style={{ height:'8%', background:'#94a3b8' }} />

      {SPOT_IDS.map(id => {
        const t = SPOT_TYPE[id];
        const c = SC[t];
        const p = spotPos(id);
        const u = asgn[id] || '';
        const r = u ? res[u] : null;
        const isMe = u === me;
        const tag = t === 'c'
          ? <span style={{ fontSize:8, fontWeight:700, color:'#b45309', lineHeight:1 }}>경차</span>
          : t === 'e'
          ? <span style={{ fontSize:8, fontWeight:700, color:'#15803d', lineHeight:1 }}>EV</span>
          : null;

        return (
          <div
            key={id}
            onClick={() => onSpotClick(id)}
            className="absolute flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105"
            style={{
              left:`${p.x}%`, top:`${p.y}%`, width:`${p.w}%`, height:`${p.h}%`,
              borderRadius:8, borderWidth:2, borderStyle: u ? 'solid' : 'dashed',
              borderColor: c.b, background: u ? c.bg : c.em, gap: 2, zIndex:1,
            }}
          >
            <span style={{ fontSize:10, fontWeight:500, color:'#374151', lineHeight:1 }}>{id}면</span>
            {u && <span style={{ fontSize:13, fontWeight:700, color: isMe ? '#2563eb' : '#6b7280', lineHeight:1.1 }}>{u}</span>}
            {r?.model && <span style={{ fontSize:9, color:'#9ca3af', lineHeight:1 }}>{r.model}</span>}
            {tag}
          </div>
        );
      })}
    </div>
  );
}
