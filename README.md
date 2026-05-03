# 우리빌라 스마트 주차 관리

React + Vite + Tailwind CSS로 만든 빌라 주차 관리 앱입니다.

## 🚀 GitHub Pages 배포

### 1단계 — 리포지토리 생성
GitHub에서 `villa-parking` 이름으로 새 리포지토리 생성

### 2단계 — vite.config.js 수정
리포지토리 이름이 다르면 `base` 경로를 수정하세요:
```js
base: '/YOUR_REPO_NAME/',
```

### 3단계 — Push
```bash
git init
git add .
git commit -m "init: villa parking app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/villa-parking.git
git push -u origin main
```

### 4단계 — GitHub Pages 활성화
리포지토리 → Settings → Pages → Source: **GitHub Actions** 선택

Push 후 자동으로 배포됩니다. (~2분 소요)

## 💻 로컬 실행
```bash
npm install
npm run dev
```

## 🔑 테스트 계정
| 호수 | 비밀번호 | 권한 |
|------|----------|------|
| 101호 | 1234 | 관리자 |
| 나머지 호수 | 1234 | 일반 거주자 |

## 📁 구조
```
src/
├── App.jsx              # 메인 앱 + 라우터
├── data/store.js        # 초기 데이터 & 상수
├── utils/helpers.js     # 유틸리티 함수
├── components/
│   ├── ParkingMap.jsx   # 주차 지도
│   ├── SpotSheet.jsx    # 주차면 바텀시트
│   ├── VisitSheet.jsx   # 방문 현황 바텀시트
│   └── PeriodFields.jsx # 기간 입력 공통 컴포넌트
└── pages/Pages.jsx      # 로그인, 방문자폼, 방문자관리, 내정보, 관리자
```
