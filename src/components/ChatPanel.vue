<template>
  <div class="adv-page-content chat-panel">
    <!-- 헤더 -->
    <div class="adv-page-content-header">
      <div class="flx-align-center gap4 min-h-32">
        <el-icon :size="16" color="#999"><Grid /></el-icon>
        <span class="header-title">상담내용</span>
      </div>
    </div>

    <!-- 메시지 영역 -->
    <div class="adv-page-scroll adv-chat-content" ref="scrollRef">
      <div v-if="messages.length === 0" class="adv-empty-text-container">
        <span>고객 상담 대기중입니다.</span>
      </div>

      <template v-for="message in messages" :key="message.id">
        <SpeechBubble
          :message="message"
          :selectedKeyword="expandedMessageId === message.id ? selectedKeyword : null"
          @keyword-click="(keyword) => $emit('keyword-click', message.id, keyword)"
        />

        <!-- 키워드 클릭 시 문서 목록 -->
        <div
          v-if="expandedMessageId === message.id && selectedKeyword && documents.length > 0"
          class="keyword-documents"
        >
          <div class="keyword-documents-header">
            <span class="documents-header-text">관련 문서</span>
          </div>
          <div class="keyword-documents-list">
            <div
              v-for="doc in documents"
              :key="doc.id"
              class="keyword-document-item"
              @click="$emit('document-click', doc)"
            >
              <div class="document-item-content">
                <span class="document-item-title">{{ doc.title }}</span>
                <div class="document-item-keywords">
                  <el-tag
                    v-for="kw in doc.keywords"
                    :key="kw"
                    size="small"
                    type="info"
                    effect="plain"
                  >
                    #{{ kw }}
                  </el-tag>
                </div>
              </div>
              <div class="document-item-actions">
                <el-button
                  class="feedback-btn"
                  :class="{ 'feedback-active': documentFeedback[doc.id] === 'up' }"
                  size="small"
                  circle
                  @click.stop="handleDocumentFeedback(doc.id, 'up')"
                >
                  <svg class="thumb-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"/>
                  </svg>
                </el-button>
                <el-button
                  class="feedback-btn"
                  :class="{ 'feedback-active': documentFeedback[doc.id] === 'down' }"
                  size="small"
                  circle
                  @click.stop="handleDocumentFeedback(doc.id, 'down')"
                >
                  <svg class="thumb-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 4h-2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h2V4zM2.17 11.12c-.11.25-.17.52-.17.8V13c0 1.1.9 2 2 2h5.5l-.92 4.65c-.05.22-.02.46.08.66.23.45.52.86.88 1.22L10 22l6.41-6.41c.38-.38.59-.89.59-1.42V6.34C17 5.05 15.95 4 14.66 4H6.55c-.7 0-1.36.37-1.72.97l-2.66 6.15z"/>
                  </svg>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 입력 영역 -->
    <div class="chat-input-area">
      <el-input
        v-model="inputValue"
        placeholder="메시지를 입력하세요..."
        @keyup.enter="handleSubmit"
        clearable
      >
        <template #append>
          <el-button type="primary" @click="handleSubmit">
            <el-icon><Promotion /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { Grid, Filter, Promotion } from '@element-plus/icons-vue'
import SpeechBubble from './SpeechBubble.vue'

const props = defineProps({
  messages: Array,
  selectedKeyword: String,
  expandedMessageId: Number,
  documents: Array,
})

const emit = defineEmits(['keyword-click', 'send-message', 'document-click'])

const inputValue = ref('')
const scrollRef = ref(null)

// 문서별 피드백 상태 관리
const documentFeedback = ref({})

const handleDocumentFeedback = (docId, type) => {
  if (documentFeedback.value[docId] === type) {
    documentFeedback.value[docId] = null
  } else {
    documentFeedback.value[docId] = type
  }
}

const handleSubmit = () => {
  if (inputValue.value.trim()) {
    emit('send-message', inputValue.value.trim())
    inputValue.value = ''
  }
}

watch(() => props.messages, () => {
  nextTick(() => {
    if (scrollRef.value) {
      scrollRef.value.scrollTo({
        top: scrollRef.value.scrollHeight,
        behavior: 'smooth'
      })
    }
  })
}, { deep: true })
</script>

<style scoped>
.chat-panel {
  flex: 1;
  min-width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 헤더 */
.header-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--color-g35);
  margin-left: 6px;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.icon-button {
  padding: 4px;
  color: var(--color-g40);
}

/* 채팅 영역 */
.adv-chat-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

/* 문서 목록 */
.keyword-documents {
  margin: 12px 0 20px 16px;
  padding: 16px;
  background: var(--color-background);
  border: 1px solid var(--border-color-divider);
  border-radius: 8px;
  max-width: 85%;
}

.keyword-documents-header {
  margin-bottom: 12px;
}

.documents-header-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-g40);
}

.keyword-documents-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.keyword-document-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: var(--color-white);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.keyword-document-item:hover {
  background: var(--color-primary-10);
  border-color: var(--color-primary);
}

.document-item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.document-item-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--color-black);
}

.document-item-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.document-item-keywords .el-tag {
  font-size: 11px;
}

.document-item-actions {
  display: flex;
  gap: 4px;
  margin-left: 12px;
}

.document-item-actions .el-button + .el-button {
  margin-left: 0;
}

.feedback-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--border-color-divider);
  background: var(--color-background);
}

.feedback-btn:hover {
  border-color: var(--color-primary);
  background: var(--color-white);
}

.feedback-btn .el-icon {
  font-size: 14px;
  color: var(--color-g60);
}

.thumb-icon {
  width: 14px;
  height: 14px;
  color: var(--color-g60);
}

/* 피드백 버튼 활성화 상태 */
.feedback-btn.feedback-active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.feedback-btn.feedback-active .thumb-icon {
  color: var(--color-white);
}

/* 입력 영역 */
.chat-input-area {
  padding: 12px 16px;
  border-top: 1px solid var(--border-color-divider);
}

.chat-input-area :deep(.el-input-group__append) {
  padding: 0;
  background: transparent;
  border: none;
}

.chat-input-area :deep(.el-input-group__append .el-button) {
  margin: 0;
  border-radius: 0 4px 4px 0;
  height: 100%;
}
</style>
