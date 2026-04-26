/**
 * DPApproachTabs — approach switcher used across all DP pattern components.
 *
 * Props:
 *   activeApproach  - currently selected approach string
 *   onChange        - callback(approach: string)
 *   className       - optional extra class on the wrapper
 */
const APPROACHES = [
  { id: 'recursion',   label: '🔄 Recursion'   },
  { id: 'memoization', label: '💾 Memoization'  },
  { id: 'tabulation',  label: '📊 Tabulation'   },
]

export default function DPApproachTabs({ activeApproach, onChange, className = '' }) {
  return (
    <div className={`dp-approach-tabs ${className}`}>
      {APPROACHES.map(({ id, label }) => (
        <button
          key={id}
          className={`dp-approach-tab ${activeApproach === id ? 'active' : ''}`}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
