export default function PlaybackControls({
  isPaused,
  currentStep,
  totalSteps,
  onReset,
  onPlay,
  onPause,
  onNext,
  onPrev,
  speed,
  onSpeedChange,
}) {
  const atEnd = currentStep >= totalSteps - 1
  const atStart = currentStep === 0

  const btnBase = "flex items-center justify-center w-9 h-9 bg-gray-50 border border-gray-200 rounded-md text-base font-semibold cursor-pointer transition-all text-gray-800 hover:enabled:bg-indigo-500 hover:enabled:border-indigo-500 hover:enabled:text-white hover:enabled:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"

  return (
    <div className="flex items-center gap-2.5 py-3.5 flex-wrap">
      <button className={btnBase} onClick={onReset} title="Reset">↺</button>
      <button className={btnBase} onClick={onPrev} disabled={atStart} title="Previous">⏮</button>
      {isPaused ? (
        <button
          className="flex items-center justify-center w-10.5 h-9 bg-indigo-500 border border-indigo-500 text-white rounded-md text-base font-semibold cursor-pointer transition-all hover:enabled:bg-indigo-600 hover:enabled:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}
          onClick={onPlay} disabled={atEnd} title="Play"
        >▶</button>
      ) : (
        <button
          className="flex items-center justify-center w-10.5 h-9 bg-indigo-500 border border-indigo-500 text-white rounded-md text-base font-semibold cursor-pointer transition-all hover:enabled:bg-indigo-600 hover:enabled:scale-110"
          style={{ boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}
          onClick={onPause} title="Pause"
        >⏸</button>
      )}
      <button className={btnBase} onClick={onNext} disabled={atEnd} title="Next">⏭</button>
      <span className="text-[13px] font-semibold text-gray-800 min-w-17.5">
        {currentStep + 1} / {totalSteps}
      </span>
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-lg">🐢</span>
        <input
          type="range" min="100" max="600" value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-30 h-1 rounded bg-gray-200"
        />
        <span className="text-lg">🐇</span>
      </div>
    </div>
  )
}
