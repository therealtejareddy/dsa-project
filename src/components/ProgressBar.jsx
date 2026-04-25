export default function ProgressBar({ current, total }) {
  const pct = total > 0 ? ((current / (total - 1)) * 100).toFixed(1) : 0
  return (
    <div className="relative w-full h-1 bg-gray-200 rounded overflow-hidden mb-2.5">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-[width] duration-300 rounded"
        style={{ width: `${pct}%` }}
      />
      <span className="absolute text-[11px] font-semibold text-gray-500" style={{ top: '-20px', right: 0 }}>
        {pct}%
      </span>
    </div>
  )
}
