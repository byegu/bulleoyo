<div align="center">
  <img src="frontend/src/assets/brand/bulleoyo-logo-variant-a.svg" width="220" alt="불러요 로고" />
  <h1>불러요 Bulleoyo</h1>
  <p><strong>공동 공연의 티켓 예매부터 입장과 수익 정산까지</strong></p>
  <p>공연 탐색 · 팀 선택 · 지갑 서명 · QR 입장 · 공동 정산</p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Solidity-363636?logo=solidity&logoColor=white" alt="Solidity" />
</div>

## 프로젝트 소개

불러요는 여러 밴드가 함께 여는 소규모 공연의 티켓 예매·입장·수익 정산을 연결한 플랫폼입니다. 관객은 응원할 팀을 선택해 예매하고, 공연팀은 사전에 합의한 정산 규칙에 따라 분배 결과를 확인합니다.

Kaia Kairos 테스트넷과 YoYo 코인으로 거래 과정을 시연합니다. 법정화폐 결제나 실제 매출을 운영한 서비스는 아닙니다.

| 기간 | 팀 규모 | 프로젝트 | 담당 |
| --- | --- | --- | --- |
| 2026.08.26 ~ 2026.10.02 | 5명 | SSAFY 특화 프로젝트 · 핀테크 | 강병구 · 팀장 / Frontend |

## 서비스 화면

| 공연 탐색 | 주문 확인 및 결제 |
| :---: | :---: |
| <img src="docs/readme/screens/home.jpg" width="460" alt="공연 탐색 시연 화면" /> | <img src="docs/readme/screens/order-confirm.jpg" width="460" alt="주문 확인 및 결제 시연 화면" /> |

## 주요 기능

| 기능 | 처리 내용 |
| --- | --- |
| 공연 탐색 | 판매 중인 공연과 상세 정보 조회 |
| 티켓 예매 | 관람 목적 팀 선택, 주문 생성, 사용자 지갑 서명 |
| 결제 상태 | 서명 대기·처리 중·성공·실패에 따른 화면 처리 |
| 결제 재시도 | 최신 주문·결제 상태 확인 후 기존 작업 복원 또는 새로운 시도 시작 |
| 티켓과 입장 | 예매한 티켓 확인과 QR 기반 검표 |
| 공동 정산 | 팀별 규칙 합의, 테스트넷 거래와 분배 결과 확인 |

## 시스템 구조

```mermaid
flowchart LR
  User[React Web] --> API[Spring Boot API]
  User --> Wallet[사용자 지갑 서명]
  Wallet --> Chain[Kaia Kairos]
  API --> SQL[(MySQL)]
  API --> Cache[(Redis)]
  API --> Chain
  Chain --> YoYo[YoYo Contract]
  Chain --> Splitter[RevenueSplitter]
```

프론트엔드는 서버 응답과 사용자 지갑 작업을 연결합니다. 블록체인 작업과 서버 상태 반영이 비동기로 이어지므로, API 접수나 화면 변경만으로 결제 완료를 판단하지 않습니다.

## 담당 구현

### 결제 상태와 화면 흐름

서명 대기·처리 중·성공·실패를 구분하고, 최신 조회나 체인 작업으로 성공이 확인된 뒤 완료 화면으로 이동하도록 구현했습니다.

### 실패 후 재시도

재시도 전에 주문·결제 상태를 다시 조회합니다. 처리 중인 작업이 있으면 새 결제를 시작하지 않고 기존 작업을 이어서 확인합니다. 실패 후 다시 결제할 수 있는 경우에는 새로운 멱등키로 서명을 재개하며, 실패한 작업을 다시 복원하지 않도록 처리했습니다.

```mermaid
flowchart TD
  Retry[다시 시도] --> Refresh[최신 주문·결제 조회]
  Refresh --> Done{완료됐는가}
  Done -- 예 --> Success[완료 화면]
  Done -- 아니오 --> Paying{처리 중인가}
  Paying -- 예 --> Resume[기존 작업 확인]
  Paying -- 아니오 --> Allowed{새 결제가 가능한가}
  Allowed -- 예 --> New[새 멱등키로 서명 재개]
  Allowed -- 아니오 --> Stop[새 결제 시작 중단]
```

### 회귀 테스트

결제 정보 생성 전 404, 상태 충돌, 반영 지연, 실패 후 재서명, 연속 재시도 등 화면 상태가 잘못 전환될 수 있는 경계를 테스트에 반영했습니다.

- [결제 화면](frontend/src/pages/PaymentPage.tsx)
- [결제 상태·재시도 테스트](frontend/src/pages/PaymentPage.live.test.tsx)

### 팀 역할

| 역할 | 담당 범위 |
| --- | --- |
| UI/UX | 디자인 토큰, 공통 UI, 화면 마크업 |
| Frontend · 팀장 | 앱 골격, 화면 로직·서버 상태, 지갑 연동 |
| Backend | 체인 무관 도메인 API |
| Backend · Contract | YoYo·RevenueSplitter, 코인·정산 API |
| Infra · Server Chain | 실행 환경, 서버 체인 모듈, 검증 API, 배포 |

강병구의 개인 구현 설명은 프론트엔드 결제 상태·재시도 복구와 관련 테스트를 중심으로 작성했습니다. 개발 과정에서 GPT·Codex의 도움을 받았으며, 서버·스마트컨트랙트·인프라는 다른 팀원 담당입니다.

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, TanStack Query, React Router, Tailwind CSS |
| Wallet | Web3Auth, ethers, Kaia ethers extension |
| Backend | Java 17, Spring Boot, JPA, Flyway, MySQL, Redis |
| Blockchain | Solidity, Hardhat, OpenZeppelin, Kaia Kairos |
| Runtime | Docker Compose |

## 디렉터리 구조

```text
bulleoyo/
├── frontend/            # 관객·공연자·검표 화면 및 테스트
├── backend/             # Spring Boot API와 테스트
├── blockchain/          # YoYo·RevenueSplitter 컨트랙트
├── docs/                # 설계·기술 문서와 서비스 화면
├── exec/                # 프로젝트 산출물 경로
├── scripts/             # 개발 보조 스크립트
├── .gitlab/             # 기존 협업 템플릿
└── README.md
```

## 로컬 개발

각 서비스의 `.env.example`과 예시 설정을 참고해 로컬 환경을 준비합니다. 실제 비밀키와 운영 접속정보는 환경변수로 주입합니다.

```bash
# Frontend
cd frontend
corepack enable
pnpm install
pnpm dev

# Backend — 별도 터미널
cd backend
./gradlew bootRun --args='--spring.profiles.active=local'

# Contract — 별도 터미널
cd blockchain
pnpm install
pnpm test
```

## 테스트

```bash
cd frontend
pnpm test

cd backend
./gradlew test

cd blockchain
pnpm test
```

지갑 로그인과 테스트넷 거래에는 별도 로컬 설정이 필요합니다. 운영 키와 출처 확인이 필요한 데이터·자산을 포함하지 않으므로 실행 환경은 직접 준비해야 합니다.
