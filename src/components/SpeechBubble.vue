<template>
  <div class="chat-bubble-container">
    <!-- 시스템 메시지 -->
    <div v-if="message.sender === 'system'" class="chat-bubble-system">
      <span class="system-message-text">{{ message.content }}</span>
    </div>

    <!-- 고객/상담사 메시지 -->
    <div v-else class="chat-bubble-content" :class="bubbleClasses">
      <!-- 상담사: 시간 먼저 -->
      <span v-if="message.sender === 'agent'" class="chat-bubble-time">
        {{ message.time }}
      </span>

      <div class="chat-bubble-message" :class="bubbleMessageClasses">
        <span class="chat-bubble-text">{{ message.content }}</span>
      </div>

      <!-- 고객: 시간 뒤에 -->
      <span v-if="message.sender === 'customer'" class="chat-bubble-time">
        {{ message.time }}
      </span>
    </div>

    <!-- 키워드 버튼 (고객 메시지만) -->
    <div v-if="message.sender === 'customer' && message.keywords?.length" class="keyword-buttons">
      <el-button
        v-for="keyword in message.keywords"
        :key="keyword"
        size="small"
        :class="{ 'keyword-selected': selectedKeyword === keyword }"
        class="keyword-button"
        @click="$emit('keyword-click', keyword)"
      >
        {{ keyword }}
      </el-button>
      <div class="feedback-buttons">
        <el-button
          class="feedback-btn"
          :class="{ 'feedback-active': feedbackState === 'up' }"
          size="small"
          @click="handleFeedback('up')"
        >
          <svg class="thumb-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"/>
          </svg>
        </el-button>
        <el-button
          class="feedback-btn"
          :class="{ 'feedback-active': feedbackState === 'down' }"
          size="small"
          @click="handleFeedback('down')"
        >
          <svg class="thumb-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 4h-2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h2V4zM2.17 11.12c-.11.25-.17.52-.17.8V13c0 1.1.9 2 2 2h5.5l-.92 4.65c-.05.22-.02.46.08.66.23.45.52.86.88 1.22L10 22l6.41-6.41c.38-.38.59-.89.59-1.42V6.34C17 5.05 15.95 4 14.66 4H6.55c-.7 0-1.36.37-1.72.97l-2.66 6.15z"/>
          </svg>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  message: Object,
  selectedKeyword: String,
})

defineEmits(['keyword-click'])

// 피드백 상태 관리 ('up', 'down', null)
const feedbackState = ref(null)

const handleFeedback = (type) => {
  if (feedbackState.value === type) {
    feedbackState.value = null
  } else {
    feedbackState.value = type
  }
}

const bubbleClasses = computed(() => ({
  'is-customer': props.message.sender === 'customer',
  'is-agent': props.message.sender === 'agent',
}))

const bubbleMessageClasses = computed(() => ({
  'bubble-customer': props.message.sender === 'customer',
  'bubble-agent': props.message.sender === 'agent',
}))
</script>

<style scoped>
/* 메시지 컨테이너 */
.chat-bubble-container {
  position: relative;
  margin-bottom: 20px;
}

/* 시스템 메시지 */
.chat-bubble-system {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.system-message-text {
  padding: 6px 16px;
  background: var(--color-info);
  color: var(--color-white);
  border-radius: 20px;
  font-size: 12px;
}

/* 일반 메시지 컨테이너 */
.chat-bubble-content {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding-top: 10px;
}

.chat-bubble-content.is-customer {
  justify-content: flex-start;
}

.chat-bubble-content.is-agent {
  justify-content: flex-end;
}

/* 메시지 버블 */
.chat-bubble-message {
  max-width: 70%;
  padding: 10px 16px;
  line-height: 1.5;
}

.chat-bubble-message.bubble-customer {
  background-color: var(--color-secondary);
  color: var(--color-white);
  border-radius: 0 40px 40px 40px;
}

.chat-bubble-message.bubble-agent {
  background-color: var(--color-table-bg);
  color: var(--color-g10);
  border-radius: 40px 0 40px 40px;
}

.chat-bubble-text {
  font-size: var(--font-size-body2, 14px);
  word-break: break-word;
}

/* 시간 */
.chat-bubble-time {
  white-space: nowrap;
  flex-shrink: 0;
  font-size: 12px;
  color: var(--color-g40);
}

/* 키워드 버튼 */
.keyword-buttons {
  display: flex;
  align-items: center;
  margin: 8px 0 0 4px;
  flex-wrap: wrap;
}

.keyword-button {
  border-radius: 20px;
  border: 1px solid var(--color-info);
  background: var(--color-white);
  color: var(--color-info);
  font-size: 12px;
  padding: 4px 12px;
  height: auto;
}

.keyword-button:hover {
  border-color: var(--color-secondary);
  color: var(--color-secondary);
}

.keyword-button.keyword-selected {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}

/* 피드백 버튼 */
.feedback-buttons {
  display: flex;
  gap: 4px;
  margin-left: 8px;
}

.feedback-buttons .el-button + .el-button {
  margin-left: 0;
}

.feedback-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid var(--border-color-divider);
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>
