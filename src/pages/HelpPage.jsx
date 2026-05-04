export default function HelpPage() {
  const S = {
    wrap: { maxWidth:390, margin:'0 auto', fontFamily:'var(--font-sans)', paddingBottom:40 },
    hero: { textAlign:'center', padding:'24px 16px 20px', borderBottom:'0.5px solid var(--color-border-tertiary)', marginBottom:20 },
    heroEmoji: { fontSize:36, marginBottom:8 },
    heroTitle: { fontSize:18, fontWeight:500, color:'var(--color-text-primary)', marginBottom:6 },
    heroSub: { fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.7 },
    section: { padding:'0 16px', marginBottom:24 },
    secHead: { display:'flex', alignItems:'center', gap:8, marginBottom:12, paddingBottom:8, borderBottom:'1.5px solid var(--color-border-tertiary)' },
    secEmoji: { fontSize:18 },
    secTitle: { fontSize:15, fontWeight:500, color:'var(--color-text-primary)' },
    card: { background:'var(--color-background-secondary)', border:'0.5px solid var(--color-border-tertiary)', borderRadius:'var(--border-radius-lg)', padding:14, marginBottom:10 },
    cardTitle: { fontSize:13, fontWeight:500, color:'var(--color-text-primary)', marginBottom:8 },
    cardBody: { fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.85 },
    tip: { background:'var(--color-background-info)', border:'0.5px solid var(--color-border-info)', borderRadius:'var(--border-radius-lg)', padding:'12px 14px', marginBottom:10, fontSize:13, color:'var(--color-text-info)', lineHeight:1.8 },
    warn: { background:'var(--color-background-warning)', border:'0.5px solid var(--color-border-warning)', borderRadius:'var(--border-radius-lg)', padding:'12px 14px', marginBottom:10, fontSize:13, color:'var(--color-text-warning)', lineHeight:1.8 },
    step: { display:'flex', gap:10, marginBottom:8, alignItems:'flex-start' },
    stepNum: { width:22, height:22, borderRadius:'50%', background:'var(--color-background-info)', color:'var(--color-text-info)', fontSize:12, fontWeight:500, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 },
    stepText: { fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.8, flex:1 },
    divider: { height:'0.5px', background:'var(--color-border-tertiary)', margin:'20px 16px' },
    badgeBlue: { display:'inline-block', fontSize:11, fontWeight:500, padding:'2px 8px', borderRadius:20, marginRight:4, marginBottom:4, background:'var(--color-background-info)', color:'var(--color-text-info)' },
    badgeYellow: { display:'inline-block', fontSize:11, fontWeight:500, padding:'2px 8px', borderRadius:20, marginRight:4, marginBottom:4, background:'var(--color-background-warning)', color:'var(--color-text-warning)' },
    badgeGreen: { display:'inline-block', fontSize:11, fontWeight:500, padding:'2px 8px', borderRadius:20, marginRight:4, marginBottom:4, background:'var(--color-background-success)', color:'var(--color-text-success)' },
    footer: { textAlign:'center', padding:'16px 0 8px', fontSize:12, color:'var(--color-text-tertiary)', fontStyle:'italic' },
  };

  const Step = ({ n, children }) => (
    <div style={S.step}>
      <div style={S.stepNum}>{n}</div>
      <div style={S.stepText}>{children}</div>
    </div>
  );

  return (
    <div style={S.wrap}>

      {/* 히어로 */}
      <div style={S.hero}>
        <div style={S.heroEmoji}>📖</div>
        <div style={S.heroTitle}>우리빌라 주차 관리 도움말</div>
        <div style={S.heroSub}>이 앱으로 주차 자리 확인, 방문객 등록,<br/>차주 연락까지 쉽게 할 수 있어요!</div>
      </div>

      {/* 1. 로그인 */}
      <div style={S.section}>
        <div style={S.secHead}><span style={S.secEmoji}>🔑</span><span style={S.secTitle}>처음 시작 — 로그인</span></div>
        <div style={S.card}>
          <div style={S.cardTitle}>어떻게 들어가나요?</div>
          <div style={S.cardBody}>
            <Step n="1">내가 사는 <b>호수</b>를 선택해요. (예: 101호)</Step>
            <Step n="2"><b>공용 비밀번호</b> 4자리를 입력해요.<br/>모르면 관리자에게 물어보세요.</Step>
            <Step n="3"><b>입장하기</b> 버튼을 눌러요.</Step>
          </div>
        </div>
        <div style={S.tip}>💡 방문객이라면 로그인 없이 <b>"방문자이신가요?"</b> 버튼을 눌러 차량을 등록할 수 있어요.</div>
      </div>

      <div style={S.divider} />

      {/* 2. 주차 지도 */}
      <div style={S.section}>
        <div style={S.secHead}><span style={S.secEmoji}>🗺️</span><span style={S.secTitle}>주차 지도 보기</span></div>
        <div style={S.card}>
          <div style={S.cardTitle}>주차 지도가 뭔가요?</div>
          <div style={S.cardBody}>앱을 열면 우리 빌라 주차장의 <b>전체 지도</b>가 보여요.<br/>각 칸에 <b>몇 번 자리인지</b>와 <b>어느 집 차가 있는지</b> 표시돼요.</div>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>색깔이 다른 건 무슨 뜻인가요?</div>
          <div style={S.cardBody}>
            <span style={S.badgeBlue}>파란색 테두리</span> 일반 주차 자리<br/>
            <span style={S.badgeYellow}>주황색 테두리</span> 경차 전용 (10면)<br/>
            <span style={S.badgeGreen}>초록색 테두리</span> 전기차 전용 (12면)<br/><br/>
            <b>점선</b>으로 된 자리는 배정되지 않은 빈자리예요.
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>주차 자리를 누르면?</div>
          <div style={S.cardBody}>그 자리에 주차된 <b>차량 정보</b>를 볼 수 있어요.<br/>차를 빼달라고 할 때 <b>전화하기 버튼</b>으로 바로 연락할 수 있어요.</div>
        </div>
        <div style={S.warn}>🔒 다른 집 전화번호는 화면에 표시되지 않아요. 버튼을 눌러야만 전화가 연결돼요.</div>
      </div>

      <div style={S.divider} />

      {/* 3. 내 정보 */}
      <div style={S.section}>
        <div style={S.secHead}><span style={S.secEmoji}>👤</span><span style={S.secTitle}>내 정보 관리</span></div>
        <div style={S.card}>
          <div style={S.cardTitle}>내 차량 정보 입력하기</div>
          <div style={S.cardBody}>
            오른쪽 위 <b>"내 정보"</b> 버튼을 누르면<br/>
            차량번호, 차종, 연락처를 입력하고 저장할 수 있어요.<br/><br/>
            차가 <b>2대 이상</b>이면 <b>"+ 차량 추가"</b> 버튼으로 추가해요.
          </div>
        </div>
        <div style={S.tip}>💡 내 정보를 입력해야 다른 사람이 내 차 자리를 눌렀을 때 연락을 받을 수 있어요. 꼭 입력해 주세요!</div>
        <div style={S.warn}>🔒 다른 집 차량번호와 연락처는 <b>별표(***)로 가려져</b> 표시돼요. 개인정보는 안전해요.</div>
      </div>

      <div style={S.divider} />

      {/* 4. 방문자 관리 */}
      <div style={S.section}>
        <div style={S.secHead}><span style={S.secEmoji}>🧑‍🤝‍🧑</span><span style={S.secTitle}>방문자 차량 등록</span></div>
        <div style={S.card}>
          <div style={S.cardTitle}>손님이 오실 때는 이렇게 해요</div>
          <div style={S.cardBody}>
            <Step n="1">상단 <b>"방문자 관리"</b> 버튼을 눌러요.</Step>
            <Step n="2">손님 차량번호, 차종, 연락처를 입력해요.</Step>
            <Step n="3">방문 날짜와 시간을 선택해요.</Step>
            <Step n="4"><b>"예약 등록하기"</b>를 누르면 완료!</Step>
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>손님이 직접 등록하게 하려면?</div>
          <div style={S.cardBody}><b>"링크 복사"</b> 버튼을 눌러서 손님에게 카카오톡으로 보내주세요.<br/>손님이 링크를 클릭하면 직접 차량 정보를 입력할 수 있어요.</div>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>오늘 방문 현황 배너</div>
          <div style={S.cardBody}>주차 지도 위 파란 배너 <b>"오늘 방문차량이 N대 있어요"</b>를 누르면<br/>오늘 방문 예정인 차량 목록과 전화 연결을 바로 할 수 있어요.</div>
        </div>
      </div>

      <div style={S.divider} />

      {/* 5. 안심 전화 */}
      <div style={S.section}>
        <div style={S.secHead}><span style={S.secEmoji}>📞</span><span style={S.secTitle}>안심 전화 연결</span></div>
        <div style={S.card}>
          <div style={S.cardTitle}>전화번호 없이 통화할 수 있나요?</div>
          <div style={S.cardBody}>
            네! <b>전화번호는 화면에 절대 표시되지 않아요.</b><br/>
            <b>"차주에게 전화하기"</b> 버튼을 누르면<br/>
            확인 팝업이 뜨고, <b>"확인"</b>을 선택하면 바로 전화돼요.
          </div>
        </div>
        <div style={S.warn}>⚠️ 전화를 걸면 내 전화번호가 상대방에게 표시될 수 있어요.</div>
      </div>

      <div style={S.divider} />

      {/* 6. 관리자 */}
      <div style={S.section}>
        <div style={S.secHead}><span style={S.secEmoji}>⚙️</span><span style={S.secTitle}>관리자 전용 기능</span></div>
        <div style={S.tip}>💡 관리자로 지정된 분만 볼 수 있는 메뉴예요. 일반 거주자는 보이지 않아요.</div>
        <div style={S.card}>
          <div style={S.cardTitle}>주차면 배정</div>
          <div style={S.cardBody}>
            <b>"주차장 관리 → 주차면"</b>에서 각 자리에 어느 집 차를 배정할지 정해요.<br/>
            한 집에 차가 여러 대면 어떤 차를 배정할지도 선택할 수 있어요.<br/><br/>
            🔒 <b>경차(10면)</b>와 <b>전기차(12면)</b>는 자동 변경이 없는 <b>고정 자리</b>예요.<br/>
            매달 1일, 나머지 자리는 자동으로 순서대로 바뀌어요.
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>QR 코드 생성</div>
          <div style={S.cardBody}>
            <b>메인 접속 QR</b> — 스캔하면 주차 현황 페이지로 바로 이동해요.<br/>
            주차장 입구나 게시판에 붙여두면 편리해요.<br/><br/>
            <b>방문객 등록 QR</b> — 외부 방문자가 스캔하면<br/>
            차량 등록 페이지로 바로 이동해요.
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>건물 설정</div>
          <div style={S.cardBody}>
            건물 이름과 공용 비밀번호를 변경할 수 있어요.<br/>
            비밀번호를 바꾸면 <b>꼭 모든 거주자에게 알려주세요.</b><br/>
            관리자는 여러 명 추가할 수 있어요. (최소 1명 필수)
          </div>
        </div>
      </div>

      <div style={S.divider} />

      {/* 7. 개인정보 */}
      <div style={S.section}>
        <div style={S.secHead}><span style={S.secEmoji}>🔒</span><span style={S.secTitle}>개인정보 보호 정책</span></div>
        <div style={S.card}>
          <div style={S.cardTitle}>등록 시 개인정보 동의가 필요해요</div>
          <div style={S.cardBody}>
            정보를 등록할 때마다 <b>개인정보 수집·이용 동의</b>를 해야 해요.<br/>
            동의 체크박스를 체크해야 <b>등록 버튼이 활성화</b>돼요.<br/><br/>
            · <b>내 정보 등록</b> — 입주민 개인정보 수집 동의 (퇴거 시까지 보유)<br/>
            · <b>방문자 직접 등록</b> — 방문객 개인정보 수집 동의 (출차 후 24시간 자동 파기)<br/>
            · <b>호스트 대리 등록</b> — 방문객에게 사전 동의를 받았음을 확인
          </div>
        </div>
        <div style={S.warn}>
          🛡️ <b>이 앱은 개인정보를 안전하게 보호해요.</b><br/><br/>
          · 다른 집 차량번호 → 앞부분 <b>별표(***)로 가려져요</b><br/>
          · 전화번호 → 화면에 <b>절대 표시 안 됨</b><br/>
          · 방문자 정보 → 출차 후 <b>24시간 뒤 자동 파기</b><br/>
          · 내 정보만 전체 확인 가능해요
        </div>
        <div style={{ background:'var(--color-background-danger)', border:'0.5px solid var(--color-border-danger)', borderRadius:'var(--border-radius-lg)', padding:'12px 14px', fontSize:12, color:'var(--color-text-danger)', lineHeight:1.7 }}>
          ⚠️ 타인의 개인정보를 무단으로 이용할 경우 「개인정보 보호법」에 따라 법적 처벌의 대상이 될 수 있습니다.
        </div>
      </div>

      <div style={S.footer}>Created by Selena for my parents 💙</div>

    </div>
  );
}
