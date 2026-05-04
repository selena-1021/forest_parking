import { SPOT_IDS, SPOT_TYPE, SC, BLDG, spotPos } from '../data/store';

const VB_W = 100;
const VB_H = 109;
const F = { spot: 2.2, unit: 3.2, model: 2.2 };
const LINE_H = 4.0;

export default function ParkingMap({ state, onSpotClick }) {
  const { asgn, res } = state;

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet"
      style={{ width:'100%', height:'auto', display:'block', background:'#f1f5f9', marginTop:10, flexShrink:0 }}>

      {/* 도로 */}
      <rect x={0} y={VB_H-6} width={VB_W} height={6} fill="#94a3b8" opacity={0.3} />
      {/* 건물 */}
      <rect x={BLDG} y={0.5} width={VB_W-BLDG-1} height={80} rx={1.5} fill="#fff" stroke="#cbd5e1" strokeWidth={0.4} />
      <text x={BLDG+(VB_W-BLDG-1)/2} y={40} textAnchor="middle" dominantBaseline="middle" fontSize={2.4} fill="#cbd5e1" fontWeight="600">건물</text>

      {SPOT_IDS.map(id => {
        const t    = SPOT_TYPE[id];
        const c    = SC[t];
        const p    = spotPos(id);
        const info = asgn[id] || { unit:'', carId:'' };
        const u    = info.unit || '';
        const unitRes = u ? res[u] : null;

        // 배정된 차량 찾기 (carId 매칭, 없으면 첫 번째 차)
        const cars = unitRes?.cars || [];
        const assignedCar = info.carId
          ? (cars.find(c => c.id === info.carId) || cars[0])
          : cars[0];
        const modelText = assignedCar?.model || '';

        const is07 = id === '07';
        const cx = p.x + p.w / 2;
        const cy = p.y + p.h / 2;
        const clipId = `clip-${id}`;

        // 줄 구성
        // - 일반면: "NN면 NNN호" 한 줄 + 차종
        // - 07면:   "NN면" / "NNN호" 줄바꿈 + 차종 (폰트 크기는 동일)
        const unitLabel = u ? `${u}호` : '';
        const rows = is07
          ? [
              { text:`${id}면`, size:F.unit, fill:'#000', weight:'600' },
              unitLabel ? { text:unitLabel, size:F.unit, fill:'#000', weight:'600' } : null,
              modelText ? { text:modelText, size:F.model, fill:'#9ca3af', weight:'400' } : null,
            ].filter(Boolean)
          : [
              { text: unitLabel ? `${id}면  ${unitLabel}` : `${id}면`, size:F.unit, fill:'#000', weight:'600' },
              modelText ? { text:modelText, size:F.model, fill:'#9ca3af', weight:'400' } : null,
            ].filter(Boolean);

        const totalH = rows.length * LINE_H;
        const startY = cy - totalH / 2 + LINE_H * 0.5;

        return (
          <g key={id} onClick={() => onSpotClick(id)} style={{ cursor:'pointer' }}>
            <defs>
              <clipPath id={clipId}>
                <rect x={p.x+0.4} y={p.y+0.4} width={p.w-0.8} height={p.h-0.8} rx={1.5} />
              </clipPath>
            </defs>
            <rect x={p.x+0.3} y={p.y+0.3} width={p.w-0.6} height={p.h-0.6} rx={1.8}
              fill={u ? c.bg : c.em} stroke={c.b} strokeWidth={0.55}
              strokeDasharray={u ? undefined : '1.8 0.8'} />
            <g clipPath={`url(#${clipId})`}>
              {rows.map((row, i) => (
                <text key={i} x={cx} y={startY + i * LINE_H}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={row.size} fill={row.fill} fontWeight={row.weight}>
                  {row.text}
                </text>
              ))}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
