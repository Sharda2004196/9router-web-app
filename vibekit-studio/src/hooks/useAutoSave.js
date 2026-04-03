import { useState, useEffect, useRef } from 'react'

export default function useAutoSave(saveCallback, delay = 1500) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('') // 'idle', 'saving', 'saved'
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const debouncedSave = (data) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setSaveStatus('saving')

    timeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true)
        await saveCallback(data)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus(''), 2000)
      } catch (error) {
        setSaveStatus('')
        console.error('Auto-save failed:', error)
      } finally {
        setIsSaving(false)
      }
    }, delay)
  }

  return {
    isSaving,
    saveStatus,
    debouncedSave
  }
}
