export default function PageHeader({ title, badges = [] }) {
  return (
    <header className="flex items-center gap-5 px-7 py-[18px] border-b-2 border-indigo-700 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white sticky top-0 z-10">
      <button
        className="bg-white/20 border-2 border-white/30 text-white px-4 py-2 rounded-md font-semibold cursor-pointer transition-all hover:bg-white/30 hover:-translate-x-1"
        onClick={() => window.history.back()}
      >
        ← Back
      </button>
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-2xl font-bold">{title}</h2>
        {badges.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {badges.map((badge, idx) => (
              <span
                key={idx}
                className={
                  badge.className === 'difficulty-medium'
                    ? 'inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-300 border border-amber-400 text-amber-900'
                    : badge.className === 'difficulty-easy'
                    ? 'inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-300 border border-emerald-400 text-emerald-900'
                    : badge.className === 'difficulty-hard'
                    ? 'inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-400 border border-red-500 text-white'
                    : 'inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 border border-white/30 text-white'
                }
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
