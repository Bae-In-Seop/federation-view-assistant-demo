import React, { useEffect, useRef } from 'react'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'

const VueAppWrapper = () => {
  const vueAppRef = useRef(null)
  const appInstance = useRef(null)

  useEffect(() => {
    if (vueAppRef.current && !appInstance.current) {
      appInstance.current = createApp(App)

      // Element Plus Icons 전역 등록
      for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        appInstance.current.component(key, component)
      }

      appInstance.current.use(ElementPlus)
      appInstance.current.mount(vueAppRef.current)
    }

    return () => {
      if (appInstance.current) {
        appInstance.current.unmount()
        appInstance.current = null
      }
    }
  }, [])

  return (
    <div
      ref={vueAppRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '600px'
      }}
    />
  )
}

export default VueAppWrapper
