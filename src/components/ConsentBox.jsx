import { useState } from 'react';
import { createPortal } from 'react-dom';

/* ── 동의 내용 정의 ── */
const CONSENT_DATA = {
  A: {
    modalTitle: '입주민 개인정보 수집·이용 동의',
    checkText: '[필수] 입주민 개인정보 수집 및 이용에 동의합니다.',
    showProxy: false,
    items: [
      { label:'수집 항목', value:'성명, 휴대폰 번호, 동·호수, 차량번호, 차종' },
      { label:'수집 목적', value:'입주민 확인 및 상시 주차 관리, 비상 연락' },
      { label:'보유 기간', value:'서비스 이용 종료(퇴거) 시까지' },
      { label:'동의 거부', value:'위 동의를 거부하실 수 있으나, 거부 시 주차 관리 서비스 이용이 제한됩니다.' },
    ],
  },
  B: {
    modalTitle: '방문객 개인정보 수집·이용 동의',
    checkText: '[필수] 방문객 개인정보 수집 및 이용에 동의합니다.',
    showProxy: false,
    items: [
      { label:'수집 항목', value:'휴대폰 번호, 차량번호' },
      { label:'수집 목적', value:'방문 차량 확인 및 비상 연락' },
      { label:'보유 기간', value:'출차 후 24시간 후 자동 파기' },
      { label:'동의 거부', value:'위 동의를 거부하실 수 있으나, 거부 시 방문 차량 등록이 제한됩니다.' },
    ],
  },
  C: {
    modalTitle: '방문객 정보 대리 등록 안내',
    checkText: '[필수] 방문객의 동의를 얻어 대리로 정보를 등록함에 확인합니다.',
    showProxy: true,
    items: [
      { label:'수집 항목', value:'휴대폰 번호, 차량번호' },
      { label:'수집 목적', value:'방문 차량 확인 및 비상 연락' },
      { label:'보유 기간', value:'출차 후 24시간 후 자동 파기' },
      { label:'동의 거부', value:'위 동의를 거부하실 수 있으나, 거부 시 방문 차량 등록이 제한됩니다.' },
    ],
  },
};

const LEGAL = '⚠️ 타인의 개인정보를 무단으로 이용할 경우 「개인정보 보호법」에 따라 법적 처벌의 대상이 될 수 있습니다.';

export default function ConsentBox({ type, checked, onChange }) {
  const [open, setOpen] = useState(false);
  const data = CONSENT_DATA[type];

  return (
    <>
      {/* 동의 박스 */}
      <div style={{ background:'var(--color-background-secondary)', border:'0.5px solid var(--color-border-secondary)', borderRadius:12, padding:'12px 14px', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:0 }}>
            <input
              type="checkbox"
              id={`consent-${type}`}
              checked={checked}
              onChange={e => onChange(e.target.checked)}
              style={{ width:18, height:18, flexShrink:0, accentColor:'#3b82f6', cursor:'pointer' }}
            />
            <label htmlFor={`consent-${type}`}
              style={{ fontSize:12, fontWeight:500, color:'var(--color-text-primary)', lineHeight:1.5, cursor:'pointer' }}>
              {data.checkText}
            </label>
          </div>
          <button onClick={() => setOpen(true)}
            style={{ background:'none', border:'0.5px solid var(--color-border-secondary)', borderRadius:6, padding:'4px 8px', fontSize:11, color:'var(--color-text-secondary)', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, fontFamily:'var(--font-sans)' }}>
            내용보기
          </button>
        </div>

        {/* 대리 등록 안내 (케이스 C) */}
        {data.showProxy && (
          <div style={{ marginTop:8, fontSize:11, color:'var(--color-text-secondary)', lineHeight:1.6, paddingTop:8, borderTop:'0.5px solid var(--color-border-tertiary)' }}>
            방문객을 대신하여 등록하는 경우, 해당 방문객에게 개인정보 수집에 대한 사전 동의를 얻어야 하며 이에 대한 책임은 등록자에게 있습니다.
          </div>
        )}

        {/* 법적 경고 */}
        <div style={{ marginTop:8, fontSize:11, color:'var(--color-text-danger)', lineHeight:1.6 }}>
          ⚠️ 타인의 개인정보를 무단으로 이용할 경우 법적 처벌의 대상이 될 수 있습니다.
        </div>
      </div>

      {/* 모달 — body에 직접 렌더해서 부모 overflow:hidden에 의한 클리핑 방지 */}
      {open && createPortal(
        <div
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:9999, display:'flex', alignItems:'flex-end', justifyContent:'center' }}
          onClick={e => e.target === e.currentTarget && setOpen(false)}
        >
          <div style={{ width:'100%', maxWidth:390, background:'#ffffff', borderRadius:'22px 22px 0 0', maxHeight:'85vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>
            {/* 핸들 */}
            <div style={{ width:40, height:4, background:'#e2e8f0', borderRadius:2, margin:'12px auto 0', flexShrink:0 }} />

            {/* 헤더 */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px 10px', flexShrink:0, borderBottom:'0.5px solid #f1f5f9' }}>
              <span style={{ fontSize:16, fontWeight:500, color:'#1e293b' }}>{data.modalTitle}</span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  width:30, height:30,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background:'#f8fafc',
                  border:'0.5px solid #e2e8f0',
                  borderRadius:8, cursor:'pointer',
                  fontSize:14, fontWeight:500,
                  color:'#64748b',
                  flexShrink:0, lineHeight:1,
                }}
              >✕</button>
            </div>

            {/* 내용 */}
            <div style={{ flex:1, overflowY:'auto', padding:'16px 18px 32px', background:'#ffffff' }}>
              {/* 대리 등록 강조 배너 (케이스 C) */}
              {data.showProxy && (
                <div style={{ background:'#fef9c3', border:'0.5px solid #fde68a', borderRadius:10, padding:'10px 12px', marginBottom:14, fontSize:12, color:'#92400e', lineHeight:1.7 }}>
                  📋 <strong>대리 등록 안내</strong><br/>
                  방문객을 대신하여 등록하는 경우, 해당 방문객에게 개인정보 수집에 대한 사전 동의를 얻어야 하며 이에 대한 책임은 등록자에게 있습니다.
                </div>
              )}

              {/* 항목별 내용 */}
              {data.items.map(item => (
                <div key={item.label} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11, fontWeight:500, color:'#64748b', marginBottom:4, textTransform:'uppercase', letterSpacing:.5 }}>{item.label}</div>
                  <div style={{ fontSize:13, color:'#1e293b', lineHeight:1.8 }}>{item.value}</div>
                </div>
              ))}

              {/* 법적 경고 */}
              <div style={{ background:'#fef2f2', border:'0.5px solid #fecaca', borderRadius:10, padding:'10px 12px', marginTop:8, fontSize:12, color:'#991b1b', lineHeight:1.7 }}>
                {LEGAL}
              </div>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  );
}
