export const mCar   = n => n ? n.replace(/^(.+)(\d{4})$/, (_, a, b) => a.replace(/./g, '*') + b) : '';
// 가운데 4자리 마스킹 — 표시용(confirm 알림). 실제 통화 연결에는 원본 번호 사용.
export const mPhone = p => p ? p.replace(/(\d{3})-(\d{3,4})-(\d{4})/, '$1-****-$3') : '';
export const today  = () => new Date().toISOString().slice(0, 10);
export const doCall = (phone) => {
  // confirm에는 마스킹 번호 표시 → 실제 통화 연결은 원본 번호
  const masked = mPhone(phone);
  if (window.confirm(`전화를 연결하시겠어요? (${masked})\n연결 시 고객님의 연락처가 차주에게 표시됩니다.`))
    window.location.href = 'tel:' + phone;
};

let _pid = 0;
export const nP = () => ({ id: ++_pid, s: '', e: '', f: '09:00', t: '22:00' });

export const getTodayVisits = (visits) => {
  const t = today();
  return [...visits]
    .filter(v => v.periods?.some(p => p.s <= t && p.e >= t))
    .sort((a, b) => {
      const pa = a.periods[0] || {}, pb = b.periods[0] || {};
      return pa.s !== pb.s ? pa.s.localeCompare(pb.s) : (pa.f||'').localeCompare(pb.f||'');
    });
};

// 방문 종료 후 24시간 이내인 것만 보여줌 (보유기간 정책 반영)
export const filterValidVisits = (visits) => {
  const now = Date.now();
  return visits.filter(v => {
    const last = v.periods?.[v.periods.length - 1];
    if (!last?.e || !last?.t) return true;
    // 종료일 + 종료시각 → Date 객체로 변환
    const endStr = `${last.e}T${last.t}:00`;
    const endMs  = new Date(endStr).getTime();
    // 24시간(86400000ms) 이내이면 유지
    return now - endMs < 86400000;
  });
};

export async function drawQRCanvas(canvas, url) {
  if (!canvas) return;
  try {
    const QRCode = (await import('qrcode')).default;
    await QRCode.toCanvas(canvas, url, {
      width: 160,
      margin: 2,
      color: { dark: '#111111', light: '#ffffff' },
    });
  } catch (e) {
    console.error('QR 생성 실패:', e);
  }
}
