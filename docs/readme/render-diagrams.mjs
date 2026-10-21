// README용 SVG. 최종 발표자료 26번 슬라이드의 기술 로고 원본과 연결 구조를 재사용한다.
// 실행: node docs/readme/render-diagrams.mjs (Node 18+, 외부 의존성 없음)
import { readFileSync, writeFileSync } from 'node:fs'

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const font = '"Malgun Gothic", "Noto Sans KR", Arial, sans-serif'
const C = { ink: '#292841', sub: '#67647A', purple: '#5B54FF', pink: '#D9468D', line: '#DAD8E9', green: '#218060', amber: '#A86B13' }
const text = (x,y,s,size=20,fill=C.ink,weight=400,anchor='start') => `<text x="${x}" y="${y}" font-family='${font}' font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}">${esc(s)}</text>`
const rect = (x,y,w,h,fill='#FFFFFF',stroke=C.line,sw=1.5) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`
const path = (d,color=C.sub,dash=false) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" ${dash?'stroke-dasharray="7 6"':''} marker-end="url(#arrow-${color.slice(1)})"/>`
const image = (file,x,y,w,h) => {
  const svg = file.endsWith('.svg')
  const raw = readFileSync(new URL(`./architecture-assets/${file}`, import.meta.url)).toString('base64')
  return `<image x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" href="data:image/${svg?'svg+xml':'png'};base64,${raw}"/>`
}
const start = (title,desc,h) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${h}" viewBox="0 0 1200 ${h}" role="img" aria-labelledby="title desc"><title id="title">${esc(title)}</title><desc id="desc">${esc(desc)}</desc><defs>${Object.values(C).map(c=>`<marker id="arrow-${c.slice(1)}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="${c}"/></marker>`).join('')}</defs><rect width="1200" height="${h}" fill="#FCFBFF"/>`

const system = [start('불러요 시스템 구조와 프론트엔드 담당 범위','최종 발표자료의 시스템 연결 구조를 문서용으로 재구성했다. 관객·공연팀의 React 프론트엔드는 Web3Auth 지갑과 Spring Boot API를 연결한다. API는 MySQL·Redis와 Kaia Kairos 테스트넷의 YoYo 및 RevenueSplitter에 연결한다. 개인 구현은 프론트엔드 결제 상태와 재시도 복구이며 백엔드·컨트랙트·인프라는 팀 구현이다.',850)]
system.push(text(44,58,'불러요 시스템 구조',32,C.ink,700),text(44,92,'최종 발표자료 기반 · 팀 전체 구성과 개인 담당 범위',19,C.sub))
system.push(rect(907,38,249,48,'#EFEDFF','#DCD8FF'),text(1031,69,'Kaia Kairos 테스트넷',18,C.purple,700,'middle'))
// 로그인·지갑은 체인 자체가 아닌 클라이언트 인증·서명 연동이다.
system.push(rect(294,145,238,113),image('web3auth.png',315,163,196,43),text(413,238,'로그인 · 지갑 서명',18,C.sub,400,'middle'))
system.push(path('M413 258 V302',C.purple),text(435,286,'지갑 연동',16,C.purple))
system.push(rect(44,324,170,204),text(129,370,'사용자',24,C.ink,700,'middle'),text(129,410,'관객',20,C.sub,400,'middle'),text(129,443,'공연팀',20,C.sub,400,'middle'),text(129,476,'검표 담당',20,C.sub,400,'middle'))
system.push(path('M214 426 H290',C.purple),text(253,407,'이용',16,C.sub,400,'middle'))
system.push(rect(294,306,238,240,'#F1EFFF',C.purple,2.5),text(316,339,'Frontend',23,C.purple,700),image('react.png',316,357,75,70),image('vite.png',427,357,71,70),text(316,460,'React · TypeScript',21,C.ink,700),text(316,492,'화면 상태 · 서버 상태',18,C.sub),text(316,522,'결제 상태 · 재시도 복구',18,C.purple,700))
system.push(path('M532 426 H602',C.sub),text(567,405,'API',16,C.sub,400,'middle'))
system.push(rect(606,306,238,240),text(628,339,'Backend',23,C.ink,700),image('spring-boot.png',628,362,194,97),text(628,492,'공연 · 예매 · 결제 API',18,C.sub),text(628,522,'체인 작업 · 상태 반영',18,C.sub))
system.push(path('M844 426 H914',C.sub),text(879,405,'거래',16,C.sub,400,'middle'))
system.push(rect(918,306,238,240),text(940,339,'Blockchain',23,C.ink,700),image('kaia.png',945,362,184,68),text(940,470,'YoYo',22,C.ink,700),text(940,500,'RevenueSplitter',21,C.ink,700),text(940,529,'테스트 코인 · 공동 정산',18,C.sub))
system.push(path('M725 546 V604',C.sub),text(744,583,'조회 · 저장',16,C.sub))
system.push(rect(574,608,302,97),image('mysql.svg',596,624,118,57),image('redis.png',737,633,113,42))
system.push(text(44,620,'개인 담당',19,C.purple,700),text(44,652,'Frontend 결제 상태와',21,C.ink,700),text(44,683,'실패 후 재시도 복구',21,C.ink,700))
system.push(`<line x1="44" y1="741" x2="1156" y2="741" stroke="${C.line}"/>`,text(44,779,'팀 구성: Backend · Contract · Infra는 다른 팀원 담당',19,C.sub),text(44,815,'배포 구성: Docker Compose  /  법정화폐 결제·상용 운영 성과를 의미하지 않음',18,C.sub),'</svg>')
writeFileSync(new URL('./system-architecture.svg', import.meta.url),system.join('\n')+'\n')

const flow = [start('프론트엔드 결제 재시도 판단 흐름','재시도는 중복 실행을 차단한 뒤 최신 주문과 결제를 다시 조회한다. 성공이 확인되면 완료 화면으로 이동하고 처리 중이면 기존 작업을 확인한다. 새 결제가 가능한 실패에는 새 멱등키로 서명을 재개하고 결제 불가 조건에서는 새 실행을 중단한다. 백엔드와 체인은 팀 구현이며 그림은 프론트엔드 판단 경계를 나타낸다.',840)]
flow.push(text(44,58,'결제 재시도, 화면에서 확인할 경계',30,C.ink,700),text(44,92,'PaymentPage · 개인 구현 범위: 상태 판단과 화면 전환',19,C.sub))
flow.push(rect(44,140,238,112,'#F1EFFF',C.purple,2),text(66,178,'01  다시 시도',23,C.purple,700),text(66,217,'처리 중 중복 실행 차단',18,C.sub))
flow.push(path('M282 196 H346',C.purple),rect(350,140,398,112),text(374,178,'02  최신 상태 확인',23,C.ink,700),text(374,217,'주문·결제 상태를 다시 조회',19,C.sub))
flow.push(path('M748 196 H814',C.purple),rect(818,140,338,112,'#F8F7FC'),text(842,178,'03  결과에 맞게 분기',23,C.ink,700),text(842,217,'API 접수만으로 완료하지 않음',18,C.sub))
flow.push(path('M987 252 V291 H190 V333',C.sub),path('M987 291 H600 V333',C.sub),path('M987 291 H1010 V333',C.sub))
flow.push(rect(44,337,292,174,'#EDF8F3','#A9D7C3'),text(68,376,'완료 확인',23,C.green,700),text(68,417,'최신 조회 또는 체인 작업에서',18,C.sub),text(68,448,'성공을 확인한 경우',18,C.sub),text(68,485,'완료 화면으로 이동',21,C.green,700))
flow.push(rect(454,337,292,174,'#F1EFFF','#C9C3FF'),text(478,376,'처리 중',23,C.purple,700),text(478,417,'진행 중인 작업이 있으면',18,C.sub),text(478,448,'새 결제를 시작하지 않음',18,C.sub),text(478,485,'기존 작업 이어서 확인',21,C.purple,700))
flow.push(rect(864,337,292,174,'#FFF7E8','#E6C995'),text(888,376,'새 결제 가능 여부',23,C.amber,700),text(888,417,'주문 상태 · 유효 시간 등',18,C.sub),text(888,448,'다시 결제할 조건 확인',18,C.sub),text(888,485,'가능한 경우에만 재개',21,C.amber,700))
flow.push(path('M1010 511 V551 H753 V592',C.amber),text(834,572,'가능',17,C.amber),path('M1010 551 H1047 V592',C.sub),text(1070,572,'불가',17,C.sub))
flow.push(rect(565,596,360,128,'#FFF7E8','#E6C995'),text(589,635,'새 멱등키로 서명 재개',23,C.amber,700),text(589,671,'실패한 작업은 다시 복원하지 않음',18,C.sub),text(589,701,'성공 확인 전에는 완료 처리 보류',18,C.sub))
flow.push(rect(955,596,201,128,'#F3F2F7'),text(1055,640,'새 결제',22,C.ink,700,'middle'),text(1055,675,'시작 중단',22,C.ink,700,'middle'))
flow.push(`<line x1="44" y1="767" x2="1156" y2="767" stroke="${C.line}"/>`,text(44,806,'서명 요청·체인 작업·서버 상태 반영은 비동기이며, 이 그림은 프론트엔드의 판단 흐름을 요약합니다.',18,C.sub),'</svg>')
writeFileSync(new URL('./payment-recovery.svg', import.meta.url),flow.join('\n')+'\n')
console.log('system-architecture.svg, payment-recovery.svg 생성 완료')
