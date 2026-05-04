// ─── 레이아웃 상수 ─────────────────────────────────────
export const W=24, H=14, RG=1.2, LX=1, BLDG=82, RX=82-24;
export const W07=16, H07=28;
export const BT_Y = 1 + 6*H + 5*RG + 2;
export const GAP3 = (BLDG - LX - 3*W) / 2;
export const BM_X = LX + W + GAP3;

export function spotPos(id) {
  const n = parseInt(id);
  const X07 = RX + W - W07;
  if (n >= 1 && n <= 6) return { x:LX, y:1+(n-1)*(H+RG), w:W, h:H };
  if (id==='07') return { x:X07, y:1, w:W07, h:H07 };
  if (id==='08') return { x:RX, y:1+H07+RG, w:W, h:H };
  if (id==='09') return { x:RX, y:1+H07+RG+H+RG, w:W, h:H };
  if (id==='10') return { x:RX, y:1+H07+RG+2*(H+RG), w:W, h:H };
  if (id==='11') return { x:LX, y:BT_Y, w:W, h:H };
  if (id==='12') return { x:Math.round(BM_X), y:BT_Y, w:W, h:H };
  if (id==='13') return { x:RX, y:BT_Y, w:W, h:H };
  return { x:0, y:0, w:W, h:H };
}

export const SPOT_IDS = ['01','02','03','04','05','06','07','08','09','10','11','12','13'];
export const SPOT_TYPE = {
  '01':'g','02':'g','03':'g','04':'g','05':'g','06':'g',
  '07':'g','08':'g','09':'g','10':'c','11':'g','12':'e','13':'g'
};
export const SC = {
  g:{ b:'#3b82f6', bg:'rgba(59,130,246,.14)', em:'rgba(59,130,246,.05)' },
  c:{ b:'#d97706', bg:'rgba(217,119,6,.15)',  em:'rgba(217,119,6,.05)'  },
  e:{ b:'#16a34a', bg:'rgba(22,163,74,.14)',  em:'rgba(22,163,74,.05)'  },
};

export const UNITS_DEF = ['101','102','103','201','202','203','301','302','303','B101','B102','B103'];
export const BASE = 'https://forest-parking.vercel.app';
export const QR_CFGS = [
  { key:'main',    label:'메인 접속 QR',   desc:'거주자용 — 스캔 시 메인 로그인 페이지로 접속됩니다.',     guide:'우리 빌라 주차 현황 보기', url:`${BASE}/` },
  { key:'visitor', label:'방문객 등록 QR', desc:'외부인용 — 스캔 시 즉시 방문자 등록 폼으로 이동합니다.', guide:'방문객 차량 등록하기',      url:`${BASE}/visit` },
];

// 새 차량 항목 생성 헬퍼
let _cid = 0;
export const newCar = () => ({ id:`c${++_cid}`, car:'', model:'', phone:'' });

// 초기 res 구조: 호수별 cars 배열
const emptyUnit = () => ({ cars: [newCar()] });

// 초기 asgn 구조: 면별 { unit, carId }
const initAsgn = () => ({
  '01':{ unit:'101', carId:'' }, '02':{ unit:'102', carId:'' },
  '03':{ unit:'103', carId:'' }, '04':{ unit:'201', carId:'' },
  '05':{ unit:'202', carId:'' }, '06':{ unit:'203', carId:'' },
  '07':{ unit:'301', carId:'' }, '08':{ unit:'302', carId:'' },
  '09':{ unit:'303', carId:'' }, '10':{ unit:'B101', carId:'' },
  '11':{ unit:'B102', carId:'' }, '12':{ unit:'B103', carId:'' },
  '13':{ unit:'', carId:'' },
});

export const INIT_STATE = {
  in:false, me:null, pw:'1234', title:'우리빌라',
  admins:['101'],
  asgn: initAsgn(),
  res: Object.fromEntries(UNITS_DEF.map(u => [u, emptyUnit()])),
  visits:[],
};
