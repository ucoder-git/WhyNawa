# 펫앤24 (Pet&24) - 종합 펫케어 플랫폼

당근마켓 스타일의 펫용품 거래 플랫폼과 24시간 펫 응급 서비스를 결합한 종합 펫케어 플랫폼입니다.

## 주요 기능

### 🛒 펫용품 거래 (메인 기능)
- 당근마켓 스타일의 직관적인 UI/UX
- 카테고리별 상품 분류 (사료, 간식, 장난감, 의류, 하우스 등)
- 지역별 검색 및 필터링
- 상품 등록 및 관리
- 찜하기 기능

### 🚨 24시간 펫 응급센터
- 24시간 응급병원 정보 제공
- 응급 상황 예약 시스템
- 1588-0119 응급전화 바로 연결
- 지역별 응급병원 검색

### 🏪 펫서비스 디렉토리
- 펫카페, 펫미용실, 펫수영장, 훈련소 등
- 서비스 타입별 검색 및 필터링
- 평점 및 리뷰 시스템
- 영업시간 및 연락처 정보

### 👥 펫커뮤니티
- 실종/발견 신고
- 입양 정보 공유
- 펫 모임 및 산책 메이트
- 일반 펫 정보 공유

## 기술 스택

### Frontend
- **React 18** with TypeScript
- **Vite** for build tool
- **Wouter** for routing
- **TanStack React Query** for state management
- **Tailwind CSS** + **shadcn/ui** for styling
- **React Hook Form** + **Zod** for form validation

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** with **Drizzle ORM**
- **Neon Database** (serverless PostgreSQL)
- **Express Sessions** for authentication

## 프로젝트 구조

```
├── client/           # React 프론트엔드
│   ├── src/
│   │   ├── components/   # UI 컴포넌트
│   │   ├── pages/        # 페이지 컴포넌트
│   │   ├── hooks/        # 커스텀 훅
│   │   └── lib/          # 유틸리티
├── server/           # Express 백엔드
│   ├── routes.ts     # API 라우트
│   ├── storage.ts    # 데이터베이스 작업
│   └── db.ts         # 데이터베이스 연결
├── shared/           # 공유 타입 및 스키마
└── migrations/       # 데이터베이스 마이그레이션
```

## 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
# .env 파일 생성
DATABASE_URL=your_postgresql_connection_string
```

### 3. 데이터베이스 설정
```bash
npm run db:push
```

### 4. 개발 서버 실행
```bash
npm run dev
```

## 배포

### Replit 배포
- Replit에서 바로 실행 가능
- 환경 변수 설정 후 "Run" 버튼 클릭

### 프로덕션 빌드
```bash
npm run build
npm start
```

## 데이터베이스 스키마

- **users**: 사용자 정보
- **categories**: 상품 카테고리
- **listings**: 펫용품 거래 상품
- **emergency_hospitals**: 응급병원 정보
- **pet_services**: 펫서비스 제공업체
- **community_posts**: 커뮤니티 게시글
- **emergency_bookings**: 응급 예약 정보

## 라이선스

MIT License

## 개발자

ucoder-git

---

**펫앤24**로 반려동물과 함께하는 더 나은 생활을 시작하세요! 🐾