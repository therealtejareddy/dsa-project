import { useState, useEffect, useCallback } from 'react'

/**
 * usePlayback — shared animation playback state & controls.
 *
 * Usage:
 *   const { visualization, setVisualization, isPaused, setIsPaused,
 *           speed, setSpeed, handleReset, handleNext, handlePrev } = usePlayback()
 *
 * When you compute new data, call:
 *   setVisualization({ ...data, currentStep: 0 })
 *   setIsPaused(true)
 */
export function usePlayback(minDelay = 50) {
  const [visualization, setVisualization] = useState(null)
  const [isPaused, setIsPaused]           = useState(true)
  const [speed, setSpeed]                 = useState(400)

  const handleReset = useCallback(() => {
    setVisualization(prev => prev ? { ...prev, currentStep: 0 } : prev)
    setIsPaused(true)
  }, [])

  const handleNext = useCallback(() => {
    setVisualization(prev => {
      if (!prev || prev.currentStep >= prev.steps.length - 1) return prev
      return { ...prev, currentStep: prev.currentStep + 1 }
    })
  }, [])

  const handlePrev = useCallback(() => {
    setVisualization(prev => {
      if (!prev || prev.currentStep <= 0) return prev
      return { ...prev, currentStep: prev.currentStep - 1 }
    })
  }, [])

  // Auto-play
  useEffect(() => {
    if (!visualization || isPaused) return
    if (visualization.currentStep >= visualization.steps.length - 1) {
      setIsPaused(true)
      return
    }
    const delay = Math.max(minDelay, 800 - speed * 1.3)
    const timer = setTimeout(() => {
      setVisualization(prev => ({ ...prev, currentStep: prev.currentStep + 1 }))
    }, delay)
    return () => clearTimeout(timer)
  }, [visualization, isPaused, speed, minDelay])

  return {
    visualization,
    setVisualization,
    isPaused,
    setIsPaused,
    speed,
    setSpeed,
    handleReset,
    handleNext,
    handlePrev,
  }
}
