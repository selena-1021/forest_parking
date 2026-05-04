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
