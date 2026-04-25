export default function CharRow({ label, str, activeIdx, highlightSet }) {
  return (
    <div className="bg-white rounded-lg px-3 py-2.5 grid gap-3" style={{ gridTemplateColumns: '80px 1fr' }}>
      <div className="flex items-center text-xs font-semibold text-gray-500 font-mono">{label}</div>
      <div className="flex gap-1.5 flex-wrap items-center">
        {str.split('').map((ch, idx) => {
          const isActive = idx === activeIdx
          const isHighlight = highlightSet?.has(idx)
          return (
            <div
              key={idx}
              className={[
                'flex flex-col items-center justify-center w-9 h-11 relative rounded-md font-bold text-[13px] transition-all border-2',
                isActive
                  ? 'bg-indigo-500 border-indigo-600 text-white scale-110 shadow-md'
                  : isHighlight
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-gray-50 border-gray-200 text-gray-800',
              ].join(' ')}
            >
              <span className="text-[9px] opacity-60 absolute top-0.5">{idx}</span>
              {ch}
            </div>
          )
        })}
      </div>
    </div>
  )
}
