# Assistant Demo

상담 어시스턴트 데모 애플리케이션입니다. Module Federation의 Remote 앱으로 동작하며, Host 애플리케이션에서 로드하여 사용할 수 있습니다.

## 기술 스택

- Vue 3 + Composition API
- Element Plus
- Vite + Module Federation
- React Wrapper (Host 앱 연동용)

## 주요 기능

- 실시간 채팅 인터페이스
- 키워드 기반 관련 문서 추천
- 문서 상세 보기 (Knowledge Panel)
- 문서 피드백 (좋아요/싫어요)

## 프로젝트 구조

```
src/
├── App.vue                    # 메인 레이아웃
├── main.js                    # 앱 진입점
├── ReactWrapper.jsx           # React 래퍼 (Module Federation expose)
├── components/
│   ├── ChatPanel.vue          # 채팅 패널
│   ├── SpeechBubble.vue       # 말풍선 컴포넌트
│   └── KnowledgePanel.vue     # 문서 뷰어 패널
└── composables/
    └── useDemo.js             # 데모 상태 관리
```

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 5004)
npm run dev

# 빌드
npm run build
```

## Module Federation 설정

- **Remote Name**: `assistant_demo`
- **Expose**: `./App` → `ReactWrapper.jsx`
- **Entry**: `remoteEntry.js`

### Host 앱에서 사용

```js
// Host 앱의 federation 설정
remotes: {
  assistant_demo: 'assistant_demo@http://localhost:5004/federation-view-assistant-demo/remoteEntry.js'
}
```

## 테마 커스터마이징

Host 앱에서 CSS 변수를 통해 테마를 전달할 수 있습니다:

```css
:root {
  --theme-primary: #3895ff;  /* 메인 컬러 */
  --base-font-size: 16px;    /* 기본 폰트 크기 */
}
```
