import { useState, useEffect } from 'react'

/**
 * VisualizerWrapper
 * Wraps any visualizer content with an expand button.
 * When expanded, renders as a fixed fullscreen overlay.
 *
 * Usage:
 *   <VisualizerWrapper>
 *     <div className="visualizer">...</div>
 *     <PlaybackControls ... />
 *   </VisualizerWrapper>
 */
export default function VisualizerWrapper({ children, title }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Close on Escape key
  useEffect(() => {
    if (!isFullscreen) return
    const handler = (e) => { if (e.key === 'Escape') setIsFullscreen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isFullscreen])

  // Prevent body scroll when fullscreen
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isFullscreen])

  return (
    <>
      {/* Inline (collapsed) position — just renders children with a button overlay */}
      {!isFullscreen && (
        <div className="relative">
          {children}
          <button
            className="absolute flex items-center justify-center w-8 h-8 bg-white/90 border-[1.5px] border-gray-200 rounded-lg text-[17px] leading-none cursor-pointer text-gray-500 transition-all z-10 top-2.5 right-2.5 hover:bg-indigo-500 hover:border-indigo-600 hover:text-white hover:scale-110"
            style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
            onClick={() => setIsFullscreen(true)}
            title="Expand to fullscreen"
            aria-label="Expand visualizer"
          >
            ⛶
          </button>
        </div>
      )}

      {isFullscreen && (
        <div className="fixed inset-0 z-9999 bg-white flex flex-col" style={{ animation: 'vzFadeIn 0.18s ease' }} role="dialog" aria-modal="true">
          <div className="flex items-center gap-3 px-6 py-3.5 text-white border-b-2 border-indigo-700 shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>
            {title && <span className="text-base font-bold flex-1">{title}</span>}
            <span className="text-xs opacity-70">Press Esc to close</span>
            <button
              className="w-8.5 h-8.5 bg-white/20 border-[1.5px] border-white/35 rounded-lg text-white text-base font-bold cursor-pointer flex items-center justify-center transition-all shrink-0 hover:bg-white/35 hover:scale-110"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close fullscreen"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-6 px-8 flex flex-col gap-4">
            {children}
          </div>
        </div>
      )}
    </>
  )
}
