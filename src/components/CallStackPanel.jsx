/**
 * CallStackPanel
 *
 * Renders a live call stack visualization.
 *
 * Props:
 *  - frames : Array of frame objects to display (top of stack = last item)
 *  - renderFrame : (frame, isTop) => ReactNode  — custom renderer for each frame
 *  - title : string — panel header (default "Call Stack")
 *  - emptyText : string — text when stack is empty
 */
export default function CallStackPanel({
  frames = [],
  renderFrame,
  title = 'Call Stack',
  emptyText = 'Stack is empty',
}) {
  return (
    <div className="bg-slate-50 border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.8px] text-gray-500 bg-gray-50 border-b border-gray-200">{title}</div>
      <div className="flex flex-col max-h-85 overflow-y-auto p-2 gap-1.5">
        {frames.length === 0 && (
          <div className="text-xs text-gray-500 italic p-2.5 text-center">{emptyText}</div>
        )}
        {[...frames].reverse().map((frame, idx) => {
          const isTop = idx === 0
          return (
            <div
              key={frame.id ?? idx}
              className={isTop
                ? 'bg-indigo-50 border-[1.5px] border-indigo-500 rounded-lg px-2.5 py-2 transition-all'
                : 'bg-white border-[1.5px] border-gray-200 rounded-lg px-2.5 py-2 transition-all'
              }
              style={isTop ? { boxShadow: '0 2px 8px rgba(99,102,241,0.15)' } : {}}
            >
              {renderFrame
                ? renderFrame(frame, isTop)
                : <DefaultFrameContent frame={frame} />
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Default frame renderer — shows funcName + key/value pairs from frame.vars */
function DefaultFrameContent({ frame }) {
  const vars = frame.vars ?? {}
  return (
    <>
      <div className="text-xs font-bold text-indigo-500 mb-1 font-mono">{frame.funcName ?? 'fn'}()</div>
      <div className="flex flex-col gap-0.5">
        {Object.entries(vars).map(([k, v]) => (
          <span key={k} className="text-[11px] font-mono text-gray-500">
            <span className="text-violet-500 font-bold">{k}</span>={String(v)}
          </span>
        ))}
      </div>
    </>
  )
}
