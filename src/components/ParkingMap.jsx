import { SPOT_IDS, SPOT_TYPE, SC, BLDG, spotPos } from '../data/store';

/**
 * 완전 반응형 SVG 주차 맵
 * - viewBox="0 0 100 109" 좌표계 고정
 * - width:100% height:auto → 컨테이너에 맞춰 자동 스케일
 * - 어떤 디바이스(모바일/태블릿)에서도 잘림 없이 비율 유지
 */
const VB_W = 100;
const VB_H = 109;

// 폰트 크기 (SVG 단위, 화면 크기에 비례해 자동 조정)
const F = { spot: 3.2, unit: 4.4, model: 2.6, badge: 2.4 };

const BADGE = {
  c: { text: '경차', fill: '#fef3c7', color: '#b45309' },
  e: { text: 'EV',  fill: '#d1fae5', color: '#15803d' },
};

export default function ParkingMap({ state, onSpotClick }) {
  const { asgn, res, me } = state;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width:'100%', height:'auto', display:'block', background:'#f1f5f9', marginTop:10, flexShrink:0 }}
    >
      {/* 도로 */}
      <rect x={0} y={VB_H - 6} width={VB_W} height={6} fill="#94a3b8" opacity={0.3} />

      {/* 건물 */}
      <rect x={BLDG} y={0.5} width={VB_W - BLDG - 1} height={80} rx={1.5}
        fill="#ffffff" stroke="#cbd5e1" strokeWidth={0.4} />
      <text x={BLDG + (VB_W - BLDG - 1) / 2} y={40}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={F.badge} fill="#cbd5e1" fontWeight="600">건물</text>

      {/* 주차면 */}
      {SPOT_IDS.map(id => {
        const t   = SPOT_TYPE[id];
        const c   = SC[t];
        const p   = spotPos(id);
        const u   = asgn[id] || '';
        const r   = u ? res[u] : null;
        const isMe = u === me;
        const badge = BADGE[t];

        // 표시할 줄 목록 (null 제거)
        const textLines = [
          { text: `${id}면`, size: F.spot, fill: '#374151', weight: '500' },
          u ? { text: u,         size: F.unit,  fill: isMe ? '#2563eb' : '#6b7280', weight: '700' } : null,
          r?.model ? { text: r.model, size: F.model, fill: '#9ca3af', weight: '400' } : null,
          badge ? { text: badge.text, size: F.badge, fill: badge.color, weight: '700' } : null,
        ].filter(Boolean);

        // 줄 간격
        const lineH   = F.unit * 1.5;
        const totalH  = textLines.length * lineH;
        const cx = p.x + p.w / 2;
        const cy = p.y + p.h / 2;
        const startY = cy - totalH / 2 + lineH * 0.5;

        return (
          <g key={id} onClick={() => onSpotClick(id)} style={{ cursor: 'pointer' }}>
            {/* 주차면 배경 */}
            <rect
              x={p.x + 0.3} y={p.y + 0.3}
              width={p.w - 0.6} height={p.h - 0.6}
              rx={1.8}
              fill={u ? c.bg : c.em}
              stroke={c.b} strokeWidth={0.55}
              strokeDasharray={u ? undefined : '1.8 0.8'}
            />

            {/* 텍스트 줄 */}
            {textLines.map((line, i) => (
              <text
                key={i}
                x={cx}
                y={startY + i * lineH}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={line.size}
                fill={line.fill}
                fontWeight={line.weight}
              >{line.text}</text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
