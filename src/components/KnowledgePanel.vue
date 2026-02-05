<template>
  <div class="adv-page-content knowledge-panel">
    <!-- 헤더 -->
    <div class="adv-page-content-header">
      <div class="flx-justify-between w-full">
        <div class="flx-align-center gap4 min-h-32">
          <el-icon :size="16" color="#999"><Grid /></el-icon>
          <span class="header-title">지식저장소</span>
        </div>
        <!-- 검색바 -->
        <div class="knowledge-searchbar">
          <el-input
            v-model="searchText"
            placeholder="검색어를 입력해주세요."
            clearable
            size="default"
          >
            <template #suffix>
              <el-icon class="search-icon"><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 탭 영역 -->
    <div class="adv-page-knowledge-tabs">
      <div v-if="documentTabs.length > 0" class="tabs-header-container">
        <el-tabs
          v-model="activeTabModel"
          type="card"
          closable
          class="adv-tabs-header"
          @tab-remove="handleTabRemove"
        >
          <el-tab-pane
            v-for="doc in documentTabs"
            :key="doc.id"
            :label="doc.title"
            :name="String(doc.id)"
          />
        </el-tabs>
      </div>
    </div>

    <!-- 컨텐츠 영역 -->
    <div class="adv-page-knowledge adv-page-scroll">
      <div v-if="activeDocument" class="document-content">
        <!-- 문서 헤더 -->
        <div class="document-header">
          <el-tag type="info" size="small">{{ activeDocument.type }}</el-tag>
          <span class="document-title">{{ activeDocument.title }}</span>
        </div>

        <el-divider />

        <!-- 문서 본문 -->
        <div class="document-body">
          <template v-for="(section, idx) in parsedContent" :key="idx">
            <el-collapse v-if="section.type === 'h2'" v-model="activeSections">
              <el-collapse-item :title="section.text" :name="idx">
                <template v-for="(item, itemIdx) in section.children" :key="itemIdx">
                  <h4 v-if="item.type === 'h3'" class="section-h3">{{ item.text }}</h4>
                  <ul v-else-if="item.type === 'list'" class="section-list">
                    <li v-for="(li, liIdx) in item.items" :key="liIdx">{{ li }}</li>
                  </ul>
                  <p v-else class="section-text">{{ item.text }}</p>
                </template>
              </el-collapse-item>
            </el-collapse>
          </template>
        </div>
      </div>

      <div v-else class="adv-empty-text-container">
        <span>Chat에서 항목을 선택하거나 검색어를 입력해주세요.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Grid, Search, FullScreen } from '@element-plus/icons-vue'

const props = defineProps({
  documentTabs: Array,
  activeTabId: Number,
})

const emit = defineEmits(['tab-change', 'close-tab'])

const searchText = ref('')
const activeSections = ref([0, 1, 2, 3, 4, 5])

const activeTabModel = computed({
  get: () => props.activeTabId ? String(props.activeTabId) : '',
  set: (val) => emit('tab-change', Number(val))
})

const activeDocument = computed(() => {
  return props.documentTabs.find(doc => doc.id === props.activeTabId)
})

const handleTabRemove = (tabId) => {
  emit('close-tab', Number(tabId))
}

// 마크다운 파싱
const parsedContent = computed(() => {
  if (!activeDocument.value?.content) return []

  const lines = activeDocument.value.content.split('\n')
  const sections = []
  let currentH2 = null
  let currentList = null

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentList && currentH2) {
        currentH2.children.push({ type: 'list', items: currentList })
        currentList = null
      }
      if (currentH2) sections.push(currentH2)
      currentH2 = { type: 'h2', text: line.slice(3), children: [] }
    } else if (line.startsWith('### ') && currentH2) {
      if (currentList) {
        currentH2.children.push({ type: 'list', items: currentList })
        currentList = null
      }
      currentH2.children.push({ type: 'h3', text: line.slice(4) })
    } else if (line.startsWith('- ') && currentH2) {
      if (!currentList) currentList = []
      currentList.push(line.slice(2))
    } else if (line.trim() && currentH2) {
      if (currentList) {
        currentH2.children.push({ type: 'list', items: currentList })
        currentList = null
      }
      currentH2.children.push({ type: 'text', text: line })
    }
  }

  if (currentList && currentH2) {
    currentH2.children.push({ type: 'list', items: currentList })
  }
  if (currentH2) sections.push(currentH2)

  return sections
})

// 문서 변경 시 섹션 모두 열기
watch(activeDocument, () => {
  activeSections.value = parsedContent.value.map((_, idx) => idx)
})
</script>

<style scoped>
.knowledge-panel {
  flex: 1;
  min-width: 400px;
}

/* 헤더 */
.header-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--color-g35);
  margin-left: 6px;
}

/* 검색바 */
.knowledge-searchbar {
  min-width: 280px;
}

.knowledge-searchbar :deep(.el-input__wrapper) {
  border-radius: 28px;
  border: 1px solid var(--border-color-form-table);
  box-shadow: none;
  padding : 0 16px;
}

.knowledge-searchbar :deep(.el-input__wrapper:hover),
.knowledge-searchbar :deep(.el-input__wrapper:focus-within) {
  border-color: var(--color-primary);
}

.search-icon {
  color: var(--color-g40);
  cursor: pointer;
}

/* 탭 영역 컨테이너 */
.adv-page-knowledge-tabs {
  flex-shrink: 0;
  padding: 12px 4px 0;
  overflow: visible;
}

/* 탭 헤더 컨테이너 */
.tabs-header-container {
  overflow: visible;
  position: relative;
  display: flex;
  align-items: flex-end;
}

.adv-tabs-header {
  flex: 1;
  min-width: 0;
  margin-left: 12px;
}

/* Element Plus 탭 스타일 오버라이드 */
.adv-tabs-header :deep(.el-tabs__header) {
  margin: 0;
  border-bottom: none;
  overflow: visible;
}

.adv-tabs-header :deep(.el-tabs__nav-wrap) {
  padding: 0;
  overflow: visible;
}

.adv-tabs-header :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.adv-tabs-header :deep(.el-tabs__nav) {
  border: none !important;
  white-space: nowrap;
  overflow: visible;
}

.adv-tabs-header :deep(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
  border: none !important;
}

.adv-tabs-header :deep(.el-tabs__nav-scroll) {
  overflow-x: auto;
  overflow-y: visible;
}

.adv-tabs-header :deep(.el-tabs__nav-scroll::-webkit-scrollbar) {
  display: none;
}

.adv-tabs-header :deep(.el-tabs__content) {
  display: none;
}

.adv-tabs-header :deep(.el-tabs__item) {
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  flex-shrink: 0;
  padding: 10px 16px !important;
  height: auto !important;
  border: 1px solid var(--border-color-divider) !important;
  border-bottom: none !important;
  border-left: 1px solid var(--border-color-divider) !important;
  background: var(--color-white) !important;
  border-radius: 6px 6px 0 0 !important;
  margin-right: 4px;
  margin-left: 0;
  color: var(--color-g40);
  transition: all 0.2s;
  position: relative;
  top: 1px;
}

.adv-tabs-header :deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
  border: 1px solid var(--border-color-divider) !important;
  border-bottom: none !important;
}

.adv-tabs-header :deep(.el-tabs--card > .el-tabs__header .el-tabs__item:first-child) {
  border-left: 1px solid var(--border-color-divider) !important;
}

.adv-tabs-header :deep(.el-tabs__item:hover) {
  color: var(--color-primary);
}

.adv-tabs-header :deep(.el-tabs__item.is-active) {
  background: var(--color-white);
  color: var(--color-primary);
  border-color: var(--border-color-divider);
  border-bottom: 1px solid var(--color-white);
  position: relative;
  z-index: 1;
}

.adv-tabs-header :deep(.el-tabs__item .is-icon-close) {
  margin-left: 8px;
  width: 14px;
  height: 14px;
  font-size: 12px;
  color: var(--color-g60);
  transition: all 0.2s;
}

.adv-tabs-header :deep(.el-tabs__item .is-icon-close:hover) {
  background-color: var(--color-primary-10);
  color: var(--color-primary);
  border-radius: 50%;
}

/* 지식 컨텐츠 영역 */
.adv-page-knowledge {
  flex: 1;
  overflow-y: auto;
  background: var(--color-white);
  border-top: 1px solid var(--border-color-divider);
}

/* 문서 뷰 */
.document-content {
  background: var(--color-white);
}

.document-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.document-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--color-black);
}

.expand-btn {
  margin-left: auto;
  padding: 4px;
  color: var(--color-g35);
}

.expand-btn:hover {
  color: var(--color-primary);
}

.document-body {
  margin-top: 8px;
}

.document-body :deep(.el-collapse) {
  border: none;
}

.document-body :deep(.el-collapse-item__header) {
  font-weight: 600;
  font-size: 15px;
  background: transparent;
  border-bottom: 1px solid var(--border-color-divider);
  padding: 12px 0;
  height: auto;
  line-height: 1.5;
}

.document-body :deep(.el-collapse-item__wrap) {
  background: transparent;
  border: none;
}

.document-body :deep(.el-collapse-item__content) {
  padding: 12px 0;
}

.section-h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-g35);
  margin: 12px 0 8px;
}

.section-h3:first-child {
  margin-top: 0;
}

.section-list {
  margin: 8px 0;
  padding-left: 20px;
  color: var(--color-g10);
  font-size: 13px;
  line-height: 1.8;
}

.section-list li {
  margin: 4px 0;
}

.section-text {
  margin: 8px 0;
  font-size: 13px;
  color: var(--color-g10);
  line-height: 1.6;
}

/* 빈 상태 */
.adv-empty-text-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-g60);
  font-size: 14px;
}

/* el-divider 스타일 */
:deep(.el-divider--horizontal) {
  margin: 12px 0;
  border-top-color: var(--border-color-divider);
}
</style>
