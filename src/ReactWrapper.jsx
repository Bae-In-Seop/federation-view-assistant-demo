import React, { useEffect, useRef } from 'react'
import { createApp } from 'vue'
import App from './App.vue'

const VueAppWrapper = () => {
  const vueAppRef = useRef(null)
  const appInstance = useRef(null)

  useEffect(() => {
    if (vueAppRef.current && !appInstance.current) {
      appInstance.current = createApp(App)
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
