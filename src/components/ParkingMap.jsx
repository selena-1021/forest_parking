import { SPOT_IDS, SPOT_TYPE, SC, BLDG, spotPos } from '../data/store';

/**
 * 완전 반응형 SVG 주차 맵
 * viewBox="0 0 100 109" 좌표계 → width:100% height:auto 로 모든 기기에서 비율 유지
 */
const VB_W = 100;
const VB_H = 109;

// 폰트 크기 (SVG 단위) — h=14 안에 3줄이 딱 들어오도록 조정
const F = { spot: 2.2, unit: 3.2, model: 1.9, badge: 1.9 };
// 줄 간격: unit 폰트 기준
const LINE_H = F.unit * 1.35; // 4.32

const BADGE = {
  c: { text: '경차', color: '#b45309' },
  e: { text: 'EV',  color: '#15803d' },
};

export default function ParkingMap({ state, onSpotClick }) {
  const { asgn, res, me } = state;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: '100%', height: 'auto',
        display: 'block', background: '#f1f5f9',
        marginTop: 10, flexShrink: 0,
      }}
    >
      {/* 도로 */}
      <rect x={0} y={VB_H - 6} width={VB_W} height={6} fill="#94a3b8" opacity={0.3} />

      {/* 건물 */}
      <rect
        x={BLDG} y={0.5}
        width={VB_W - BLDG - 1} height={80}
        rx={1.5} fill="#ffffff" stroke="#cbd5e1" strokeWidth={0.4}
      />
      <text
        x={BLDG + (VB_W - BLDG - 1) / 2} y={40}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={F.badge} fill="#cbd5e1" fontWeight="600"
      >건물</text>

      {/* 주차면 */}
      {SPOT_IDS.map(id => {
        const t     = SPOT_TYPE[id];
        const c     = SC[t];
        const p     = spotPos(id);
        const u     = asgn[id] || '';
        const r     = u ? res[u] : null;
        const isMe  = u === me;
        const badge = BADGE[t];
        const is07  = id === '07';

        // 표시할 줄 목록
        const lines = [
          { text: `${id}면`, size: F.spot, fill: '#374151',                       weight: '500' },
          u       ? { text: u,          size: F.unit,  fill: isMe?'#2563eb':'#6b7280', weight: '700' } : null,
          r?.model? { text: r.model,    size: F.model, fill: '#9ca3af',               weight: '400' } : null,
          badge   ? { text: badge.text, size: F.badge, fill: badge.color,             weight: '700' } : null,
        ].filter(Boolean);

        const cx = p.x + p.w / 2;
        const cy = p.y + p.h / 2;

        // 07면(세로): clipPath로 면 경계 안에 텍스트 클리핑
        // 일반면: 줄 수에 맞춰 세로 중앙 정렬
        const totalH = lines.length * LINE_H;
        const startY = cy - totalH / 2 + LINE_H * 0.5;
        const clipId = `clip-${id}`;

        return (
          <g key={id} onClick={() => onSpotClick(id)} style={{ cursor: 'pointer' }}>
            {/* 클리핑 영역 정의 (텍스트가 면 밖으로 나가지 않도록) */}
            <defs>
              <clipPath id={clipId}>
                <rect x={p.x + 0.5} y={p.y + 0.5} width={p.w - 1} height={p.h - 1} rx={1.5} />
              </clipPath>
            </defs>

            {/* 배경 */}
            <rect
              x={p.x + 0.3} y={p.y + 0.3}
              width={p.w - 0.6} height={p.h - 0.6}
              rx={1.8}
              fill={u ? c.bg : c.em}
              stroke={c.b} strokeWidth={0.55}
              strokeDasharray={u ? undefined : '1.8 0.8'}
            />

            {/* 텍스트 (클리핑 적용) */}
            <g clipPath={`url(#${clipId})`}>
              {lines.map((line, i) => (
                <text
                  key={i}
                  x={cx}
                  y={startY + i * LINE_H}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={line.size}
                  fill={line.fill}
                  fontWeight={line.weight}
                >{line.text}</text>
              ))}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
