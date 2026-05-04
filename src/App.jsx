import { useReducer } from 'react';
import { INIT_STATE } from './data/store';
import { getTodayVisits } from './utils/helpers';
import ParkingMap from './components/ParkingMap';
import SpotSheet  from './components/SpotSheet';
import VisitSheet from './components/VisitSheet';
import { LoginPage, VisitorFormPage, VisitorsPage, MyInfoPage, AdminPage } from './pages/Pages';

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':          return { ...state, in:true, me:action.unit, page:'map' };
    case 'LOGOUT':         return { ...state, in:false, me:null, page:'map', ddOpen:false };
    case 'GOTO':           return { ...state, page:action.page, ddOpen:false, vfHost:action.vfHost??state.vfHost };
    case 'ADD_VISIT':      return { ...state, visits:[action.visit,...state.visits] };
    case 'DEL_VISIT':      return { ...state, visits:state.visits.filter(v=>v.id!==action.id) };
    case 'UPDATE_RES':     return { ...state, res:{...state.res,[action.unit]:{...state.res[action.unit],...action.data}} };
    case 'SET_ASGN': {
      const nx={...state,asgn:{...state.asgn,[action.spotId]:action.unit}};
      if(action.unit) nx.res={...nx.res,[action.unit]:{...nx.res[action.unit],car:action.car,model:action.model,phone:action.phone}};
      return nx;
    }
    case 'SETTINGS':       return { ...state, title:action.title, pw:action.pw };
    case 'ADD_ADMIN':      return { ...state, admins:[...state.admins,action.unit] };
    case 'REVOKE_ADMIN':   return state.admins.length<=1?state:{...state,admins:state.admins.filter(a=>a!==action.unit)};
    case 'SET_SHEET':      return { ...state, sheet:action.id };
    case 'TOGGLE_VSHEET':  return { ...state, visitorSheet:!state.visitorSheet };
    case 'CLOSE_VSHEET':   return { ...state, visitorSheet:false };
    case 'TOGGLE_DD':      return { ...state, ddOpen:!state.ddOpen };
    case 'CLOSE_DD':       return { ...state, ddOpen:false };
    default:               return state;
  }
}

const FULL_INIT = { ...INIT_STATE, page:'map', sheet:null, ddOpen:false, visitorSheet:false, vfHost:'' };

export default function App() {
  const [state, dispatch] = useReducer(reducer, FULL_INIT);
  const isAdmin = state.admins.includes(state.me);
  const now = new Date();
  const mo  = `${now.getFullYear()}년 ${now.getMonth()+1}월`;

  if (!state.in && state.page !== 'visitor-form') return <LoginPage state={state} dispatch={dispatch} />;
  if (state.page === 'visitor-form')               return <VisitorFormPage state={state} dispatch={dispatch} />;

  const isMap = state.page === 'map';

  return (
    <div style={{ maxWidth:390, margin:'0 auto', height:'100dvh', background:'#fff', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* 헤더 */}
      <div style={{ display:'flex', alignItems:'center', padding:'10px 14px', borderBottom:'0.5px solid #f1f5f9', background:'#fff', flexShrink:0, gap:6 }}>
        {!isMap && (
          <button onClick={()=>dispatch({type:'GOTO',page:'map'})} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 6px 4px 0', color:'#64748b', fontSize:16 }}>◀</button>
        )}
        <div style={{ flex:1 }}>
          <span onClick={()=>dispatch({type:'GOTO',page:'map'})} style={{ fontSize:15, fontWeight:500, cursor:'pointer', display:'block' }}>{state.title}</span>
          {isMap && <span style={{ fontSize:11, color:'#94a3b8' }}>{mo} · {state.me}호</span>}
        </div>
        {/* 방문자 관리 + 내 정보 — 통일된 텍스트 버튼 스타일 */}
        <button onClick={()=>dispatch({type:'GOTO',page:'visitors'})}
          style={{ padding:'6px 11px', border:'0.5px solid #e2e8f0', borderRadius:8, background:'transparent', fontSize:12, fontWeight:500, color:'#64748b', cursor:'pointer' }}>
          방문자 관리
        </button>
        <div style={{ position:'relative' }}>
          <button onClick={()=>dispatch({type:'TOGGLE_DD'})}
            style={{ padding:'6px 11px', border:'0.5px solid #e2e8f0', borderRadius:8, background:'transparent', fontSize:12, fontWeight:500, color:'#64748b', cursor:'pointer' }}>
            내 정보
          </button>
          {state.ddOpen && (
            <div style={{ position:'absolute', top:'calc(100% + 4px)', right:0, background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:12, minWidth:150, zIndex:50, overflow:'hidden', boxShadow:'0 4px 16px rgba(0,0,0,.08)' }}>
              <button onClick={()=>dispatch({type:'GOTO',page:'myinfo'})} style={{ display:'block', width:'100%', padding:'11px 14px', border:'none', background:'transparent', cursor:'pointer', fontSize:13, textAlign:'left' }}>내 정보</button>
              {isAdmin && <button onClick={()=>dispatch({type:'GOTO',page:'admin'})} style={{ display:'block', width:'100%', padding:'11px 14px', border:'none', background:'transparent', cursor:'pointer', fontSize:13, textAlign:'left' }}>주차장 관리</button>}
              <div style={{ height:'0.5px', background:'#f1f5f9' }} />
              <button onClick={()=>dispatch({type:'LOGOUT'})} style={{ display:'block', width:'100%', padding:'11px 14px', border:'none', background:'transparent', cursor:'pointer', fontSize:13, textAlign:'left', color:'#ef4444' }}>로그아웃</button>
            </div>
          )}
        </div>
      </div>

      {/* 배너 (메인만, 고정) */}
      {isMap && (
        <div onClick={()=>dispatch({type:'TOGGLE_VSHEET'})}
          style={{ margin:'10px 14px 0', padding:'12px 14px', borderRadius:12, border:'0.5px solid #93c5fd', background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', flexShrink:0 }}>
          <span style={{ fontSize:13, fontWeight:500, color:'#2563eb' }}>오늘 방문차량이 {getTodayVisits(state.visits).length}대 있어요</span>
          <span style={{ fontSize:11, color:'#2563eb' }}>자세히 보기 ›</span>
        </div>
      )}

      {/* 스크롤 영역: 맵(paddingTop 비율로 자동 높이) + 서브페이지 콘텐츠 */}
      <div style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch' }}>
        {isMap && <ParkingMap state={state} onSpotClick={id=>dispatch({type:'SET_SHEET',id})} />}
        {state.page==='visitors' && <VisitorsPage state={state} dispatch={dispatch} />}
        {state.page==='myinfo'   && <MyInfoPage   state={state} dispatch={dispatch} />}
        {state.page==='admin' && isAdmin && <AdminPage state={state} dispatch={dispatch} />}
        {/* 하단 여백 */}
        <div style={{ height:24 }} />
      </div>

      {state.sheet && <SpotSheet spotId={state.sheet} state={state} onClose={()=>dispatch({type:'SET_SHEET',id:null})} />}
      {state.visitorSheet && <VisitSheet visits={state.visits} onClose={()=>dispatch({type:'CLOSE_VSHEET'})} />}
    </div>
  );
}
