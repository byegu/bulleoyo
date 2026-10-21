# README 다이어그램 구성과 원본

## 시스템 구조

`system-architecture.svg`는 팀 최종 발표자료(2026-09-28 발표) 26번 슬라이드의 시스템 연결 구조와 기술 로고를 활용해 README용으로 재구성했다. 슬라이드 전체 화면을 그대로 붙이지 않고, 글자 잘림과 지나치게 큰 제목을 없애고 지갑 연동·애플리케이션·데이터·테스트넷의 경계를 구분했다.

발표자료에서 Web3Auth 위에 붙었던 `block chain` 표기는 체인 자체로 오해할 수 있어 로그인·지갑 서명으로 바꿨다. 배포 구성은 저장소의 `docker-compose.yml`과 대조해 Docker Compose로 표기했다. 서버 주소·접속정보·키·계정은 이미지에 넣지 않았다.

| 원본 PPTX 내부 자산 | 보존한 파일 | 용도 |
| --- | --- | --- |
| `ppt/media/image33.svg` | `architecture-assets/mysql.svg` | MySQL 로고 |
| `ppt/media/image34.png` | `architecture-assets/redis.png` | Redis 로고 |
| `ppt/media/image35.png` | `architecture-assets/spring-boot.png` | Spring Boot 로고 |
| `ppt/media/image36.png` | `architecture-assets/react.png` | React 로고 |
| `ppt/media/image37.png` | `architecture-assets/vite.png` | Vite 로고 |
| `ppt/media/image40.png` | `architecture-assets/kaia.png` | Kaia 로고 |
| `ppt/media/image41.png` | `architecture-assets/web3auth.png` | Web3Auth 로고 |

로고 파일은 발표자료에서 원본 바이트 그대로 추출했다. 각 로고의 권리는 해당 권리자에게 있으며, 프로젝트에 사용한 기술을 식별하는 용도로 포함했다. SVG 안에는 로고를 데이터 URI로 포함하여 단일 파일로 열 수 있게 했다. README는 GitHub 호환성을 위해 2배 해상도 PNG를 표시하고, 그림을 누르면 SVG 원본을 연다.

그림은 팀 전체 구성이다. 강조한 개인 구현은 프론트엔드 결제 상태·재시도 복구이며, 백엔드·컨트랙트·인프라를 개인 구현으로 주장하지 않는다. 인프라 세부 흐름은 생략한 논리 구조도이며 배포 토폴로지 전체를 의미하지 않는다.

## 결제 재시도

`payment-recovery.svg`는 기존 README의 Mermaid 흐름과 `frontend/src/pages/PaymentPage.tsx`의 `retry`, `restoreActivePaymentJob`, `failedJobIdsRef`, `idempotencyKeyRef`, 완료 처리 조건을 대조해 작성했다. 주요 분기를 읽기 쉽게 요약한 그림으로 모든 예외와 실행 순서를 표현하는 상세 시퀀스는 아니다.

- 처리 중 중복 실행을 막는다.
- 재시도 전 주문과 결제 상태를 다시 조회한다.
- 성공 확인 후에만 완료 화면으로 이동한다.
- 진행 중 작업은 이어서 확인하며, 실패 작업을 복원하지 않는다.
- 새 결제가 가능한 경우 새 멱등키로 서명 절차를 재개한다.
- 새 결제가 불가능한 조건에서는 새 실행을 중단한다.

## 수정과 재생성

`render-diagrams.mjs`와 원본 로고를 수정한 뒤 다음 명령으로 두 SVG를 재생성한다. 외부 라이브러리는 필요하지 않다.

```bash
node docs/readme/render-diagrams.mjs
```

README에 표시하는 PNG는 각 SVG를 2400px 너비로 렌더한 파일이다. 내용 수정 후 SVG와 함께 다시 렌더한다. 예를 들어 `sharp`가 설치된 환경에서는 다음과 같이 생성할 수 있다.

```bash
node -e "const sharp=require('sharp'); Promise.all(['system-architecture','payment-recovery'].map(n=>sharp('docs/readme/'+n+'.svg',{density:144}).png().toFile('docs/readme/'+n+'.png')))"
```

기존 `architecture.gen.mjs`는 별도 상세 인프라 그림용이며, 현재 README의 두 그림은 `render-diagrams.mjs`가 생성한다. 문서 재구성에 AI 보조를 사용했다. 제품 코드와 개인 기여 범위는 변경하지 않았다.
