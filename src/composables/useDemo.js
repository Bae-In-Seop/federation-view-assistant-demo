import { ref, computed, onMounted, onUnmounted } from 'vue'

// 더미 문서 데이터
const MOCK_DOCUMENTS = {
  '요금제': [
    {
      id: 1,
      type: '지식정보',
      title: '5G 요금제 안내',
      keywords: ['5G', '요금제', '데이터'],
      content: `## 5G 요금제 종류

### 5G 프리미어 플러스
- 월정액: 89,000원
- 데이터: 완전 무제한
- 통화/문자: 무제한
- 부가혜택: OTT 3종 무료

### 5G 프리미어
- 월정액: 79,000원
- 데이터: 150GB (소진 후 5Mbps)
- 통화/문자: 무제한
- 부가혜택: OTT 2종 무료

### 5G 슬림
- 월정액: 55,000원
- 데이터: 12GB (소진 후 1Mbps)
- 통화/문자: 무제한`,
    },
    {
      id: 2,
      type: '지식정보',
      title: 'LTE 요금제 안내',
      keywords: ['LTE', '요금제', '데이터'],
      content: `## LTE 요금제 종류

### LTE 무제한
- 월정액: 65,000원
- 데이터: 무제한 (일 2GB 후 3Mbps)
- 통화/문자: 무제한

### LTE 베이직
- 월정액: 45,000원
- 데이터: 6GB
- 통화/문자: 무제한

### LTE 라이트
- 월정액: 33,000원
- 데이터: 3GB
- 통화/문자: 무제한`,
    },
  ],
  '해지': [
    {
      id: 3,
      type: '업무매뉴얼',
      title: '해지 처리 절차',
      keywords: ['해지', '위약금', '절차'],
      content: `## 해지 처리 절차

### 1. 본인 확인
- 가입자 본인 확인 필수
- 대리인의 경우 위임장 및 신분증 확인

### 2. 해지 사유 확인
- 타사 이동
- 서비스 불만
- 기타 사유

### 3. 위약금 안내
- 약정 잔여기간 확인
- 단말기 할부금 잔액 안내
- 위약금 면제 조건 안내

### 4. 해지 처리
- 즉시 해지 / 월말 해지 선택
- 해지 완료 후 확인 문자 발송`,
    },
  ],
  '부가서비스': [
    {
      id: 5,
      type: '지식정보',
      title: '데이터 부가서비스',
      keywords: ['데이터', '쉐어링', '선물'],
      content: `## 데이터 부가서비스

### 데이터 쉐어링
- 가족 간 데이터 공유
- 월 2,000원
- 최대 4회선까지 공유 가능

### 데이터 선물하기
- 타인에게 데이터 선물
- 건당 1,000원 (1GB)
- 월 최대 5회 가능

### 데이터 리필
- 소진된 데이터 추가 구매
- 1GB: 5,500원
- 3GB: 11,000원`,
    },
  ],
}

// 키워드 매핑
const KEYWORD_TO_CATEGORY = {
  '요금': '요금제',
  '요금제': '요금제',
  '5G': '요금제',
  'LTE': '요금제',
  '데이터': '요금제',
  '해지': '해지',
  '위약금': '해지',
  '부가서비스': '부가서비스',
  '쉐어링': '부가서비스',
}

// 시연용 메시지 시나리오
const DEMO_MESSAGES = [
  {
    sender: 'system',
    content: '상담이 시작되었습니다.',
  },
  {
    sender: 'customer',
    content: '안녕하세요, 요금제 변경하고 싶어서요.',
    keywords: ['요금제'],
    autoKeyword: '요금제',
    autoDocId: 1,
  },
  {
    sender: 'agent',
    content: '안녕하세요, 고객님. 요금제 변경 도와드리겠습니다. 현재 사용 중이신 요금제가 무엇인가요?',
  },
  {
    sender: 'customer',
    content: '지금 LTE 요금제 쓰고 있는데 5G로 바꾸고 싶어요.',
    keywords: ['LTE', '5G'],
    autoKeyword: 'LTE',
    autoDocId: 2,
  },
  {
    sender: 'agent',
    content: '네, 5G 요금제로 변경 도와드리겠습니다. 현재 5G 요금제는 프리미어 플러스, 프리미어, 슬림 3가지가 있습니다.',
  },
  {
    sender: 'customer',
    content: '그런데 혹시 해지하면 위약금이 얼마나 나오나요?',
    keywords: ['해지', '위약금'],
    autoKeyword: '해지',
    autoDocId: 3,
  },
  {
    sender: 'agent',
    content: '네, 약정 잔여 기간에 따라 위약금이 발생할 수 있습니다. 고객님의 약정 정보를 확인해보겠습니다.',
  },
  {
    sender: 'agent',
    content: '확인 결과, 고객님은 약정 잔여기간이 3개월 남으셨고, 위약금은 약 45,000원 정도 발생합니다.',
  },
  {
    sender: 'customer',
    content: '아, 그렇군요. 그럼 우선 유지하겠습니다.',
  },
  {
    sender: 'agent',
    content: '알겠습니다. 더 요청사항 없으실까요?',
  },
  {
    sender: 'customer',
    content: '네, 없습니다.',
  },
  {
    sender: 'agent',
    content: '감사합니다. 상담사 OOO 였습니다. 좋은 하루 보내세요.',
  },
  {
    sender: 'system',
    content: '통화가 종료되었습니다.',
  },
]

export function useDemo() {
  // 상태
  const messages = ref([])
  const selectedKeyword = ref(null)
  const expandedMessageId = ref(null)
  const documentTabs = ref([])
  const activeTabId = ref(null)

  let demoInterval = null
  let currentDemoIndex = 0

  // Computed
  const currentDocuments = computed(() => {
    if (!selectedKeyword.value) return []
    const category = KEYWORD_TO_CATEGORY[selectedKeyword.value]
    return category ? MOCK_DOCUMENTS[category] || [] : []
  })

  // 유틸리티 함수
  const getTimeString = () => {
    return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const findDocumentById = (docId) => {
    for (const category of Object.values(MOCK_DOCUMENTS)) {
      const doc = category.find(d => d.id === docId)
      if (doc) return doc
    }
    return null
  }

  // 핸들러
  const handleKeywordClick = (messageId, keyword) => {
    if (expandedMessageId.value === messageId && selectedKeyword.value === keyword) {
      selectedKeyword.value = null
      expandedMessageId.value = null
    } else {
      selectedKeyword.value = keyword
      expandedMessageId.value = messageId
    }
  }

  const handleDocumentClick = (doc) => {
    const existing = documentTabs.value.find(t => t.id === doc.id)
    if (existing) {
      activeTabId.value = doc.id
    } else {
      documentTabs.value.push(doc)
      activeTabId.value = doc.id
    }
    selectedKeyword.value = null
    expandedMessageId.value = null
  }

  const handleTabChange = (tabId) => {
    activeTabId.value = tabId
  }

  const handleCloseTab = (tabId) => {
    const idx = documentTabs.value.findIndex(t => t.id === tabId)
    documentTabs.value.splice(idx, 1)

    if (activeTabId.value === tabId) {
      if (documentTabs.value.length > 0) {
        activeTabId.value = documentTabs.value[documentTabs.value.length - 1].id
      } else {
        activeTabId.value = null
      }
    }
  }

  const handleSendMessage = (content) => {
    if (demoInterval) {
      clearInterval(demoInterval)
      demoInterval = null
    }

    const extractedKeywords = Object.keys(KEYWORD_TO_CATEGORY).filter(kw =>
      content.includes(kw)
    )

    const newMessage = {
      id: messages.value.length + 1,
      sender: 'customer',
      content,
      time: getTimeString(),
      keywords: extractedKeywords.length > 0 ? extractedKeywords : undefined,
    }

    messages.value.push(newMessage)

    setTimeout(() => {
      messages.value.push({
        id: messages.value.length + 1,
        sender: 'agent',
        content: '네, 확인해보겠습니다. 잠시만 기다려주세요.',
        time: getTimeString(),
      })
    }, 1000)
  }

  // 데모 자동 진행
  const runDemo = () => {
    if (currentDemoIndex >= DEMO_MESSAGES.length) {
      clearInterval(demoInterval)
      return
    }

    const demoMsg = DEMO_MESSAGES[currentDemoIndex]
    const newMessage = {
      id: messages.value.length + 1,
      sender: demoMsg.sender,
      content: demoMsg.content,
      time: getTimeString(),
      keywords: demoMsg.keywords,
    }

    messages.value.push(newMessage)

    // 자동 키워드 클릭 및 문서 선택
    if (demoMsg.autoKeyword) {
      setTimeout(() => {
        selectedKeyword.value = demoMsg.autoKeyword
        expandedMessageId.value = newMessage.id

        // 자동 문서 선택 (ID로 찾기)
        if (demoMsg.autoDocId !== undefined) {
          setTimeout(() => {
            const doc = findDocumentById(demoMsg.autoDocId)
            if (doc) {
              handleDocumentClick(doc)
            }
          }, 800)
        }
      }, 500)
    }

    currentDemoIndex++
  }

  const startDemo = () => {
    setTimeout(() => {
      runDemo()
      demoInterval = setInterval(runDemo, 2500)
    }, 1000)
  }

  const stopDemo = () => {
    if (demoInterval) {
      clearInterval(demoInterval)
    }
  }

  // 라이프사이클
  onMounted(() => {
    startDemo()
  })

  onUnmounted(() => {
    stopDemo()
  })

  return {
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
  }
}
