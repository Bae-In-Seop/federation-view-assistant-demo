<template>
  <div class="assistant-demo">
    <div class="adv-page-layout">
      <ChatPanel
        :messages="messages"
        :selectedKeyword="selectedKeyword"
        :expandedMessageId="expandedMessageId"
        :documents="currentDocuments"
        @keyword-click="handleKeywordClick"
        @send-message="handleSendMessage"
        @document-click="handleDocumentClick"
      />
      <KnowledgePanel
        :documentTabs="documentTabs"
        :activeTabId="activeTabId"
        @tab-change="handleTabChange"
        @close-tab="handleCloseTab"
      />
    </div>
  </div>
</template>

<script setup>
import ChatPanel from './components/ChatPanel.vue'
import KnowledgePanel from './components/KnowledgePanel.vue'
import { useDemo } from './composables/useDemo'

const {
  // 상태
  messages,
  selectedKeyword,
  expandedMessageId,
  documentTabs,
  activeTabId,
  currentDocuments,
  // 핸들러
  handleKeywordClick,
  handleDocumentClick,
  handleTabChange,
  handleCloseTab,
  handleSendMessage,
} = useDemo()
</script>

<style>
/* Body margin 초기화 */
body {
  margin: 0;
  padding: 0;
}

/* CSS Variables (asst-web 스타일 기반 + Host 테마 연동) */
.assistant-demo {
  /* Host에서 전달받는 테마 색상 (fallback 포함) */
  --color-primary: var(--theme-primary, #3895ff);
  --color-primary-10: color-mix(in srgb, var(--color-primary) 10%, transparent);
  --color-primary-20: color-mix(in srgb, var(--color-primary) 20%, transparent);
  --color-primary-30: color-mix(in srgb, var(--color-primary) 30%, transparent);
  --color-primary-80: color-mix(in srgb, var(--color-primary) 80%, transparent);

  /* Host에서 전달받는 폰트 크기 (fallback 포함) */
  --base-font-size: var(--base-font-size, 16px);

  /* 고정 색상 */
  --color-secondary: #666666;
  --color-info: #909399;
  --color-white: #ffffff;
  --color-black: #000000;
  --color-background: #f5f5f5;
  --color-table-bg: #f9fafb;
  --color-g10: #1a1a1a;
  --color-g20: #333333;
  --color-g35: #595959;
  --color-g40: #666666;
  --color-g60: #999999;
  --color-g80: #cccccc;
  --border-color-divider: #e4e7ed;
  --border-color-form-table: #dcdfe6;

  /* 폰트 크기 (base-font-size 기반으로 계산) */
  --font-size-subtitle3: calc(var(--base-font-size) * 0.875);
  --font-size-subtitle4: calc(var(--base-font-size) * 0.8125);
  --font-size-body2: calc(var(--base-font-size) * 0.875);
  --font-size-body3: calc(var(--base-font-size) * 0.8125);
  --font-weight-medium: 500;
  --font-weight-bold: 600;
  --line-height-100: 1;
}

#app {
  width : 100vw;
  height: 100vh;
}

.assistant-demo {
  width : 100%;
  height: 100%;
  padding: 16px;
  background: var(--color-background);
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: var(--base-font-size, 16px);
  box-sizing: border-box;
  overflow: hidden;
}

.adv-page-layout {
  display: flex;
  gap: 16px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

/* 공통 컨테이너 스타일 */
.adv-page-content {
  background: var(--color-white);
  border-radius: 8px;
  border: 1px solid var(--border-color-divider);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  height: 100%;
}

.adv-page-content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color-divider);
  min-height: 32px;
}

.adv-page-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* 유틸리티 클래스 */
.flx-align-center {
  display: flex;
  align-items: center;
}

.flx-justify-between {
  display: flex;
  justify-content: space-between;
}

.gap4 { gap: 4px; }
.gap8 { gap: 8px; }
.gap10 { gap: 10px; }
.gap12 { gap: 12px; }
.gap16 { gap: 16px; }
.gap20 { gap: 20px; }

.p16 { padding: 16px; }
.py10 { padding-top: 10px; padding-bottom: 10px; }
.px16 { padding-left: 16px; padding-right: 16px; }
.ml16 { margin-left: 16px; }
.mb10 { margin-bottom: 10px; }
.mb20 { margin-bottom: 20px; }
.mt30 { margin-top: 30px; }

.min-h-32 { min-height: 32px; }
.w-full { width: 100%; }
.w-max-content { width: max-content; }
.h-full { height: 100%; }

.border-radius8 { border-radius: 8px; }
.border-radius10 { border-radius: 10px; }
.border-radius28 { border-radius: 28px; }

.border-default {
  border: 1px solid var(--border-color-divider);
}

.bg-white-50 {
  background-color: rgba(255, 255, 255, 0.5);
}

/* 빈 상태 컨테이너 */
.adv-empty-text-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-g60);
  font-size: var(--font-size-body2);
}
</style>
