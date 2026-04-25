/**
 * Approaches Component
 * Displays backtracking approach steps in a structured format with icons and descriptions.
 *
 * Usage:
 * <Approaches
 *   approaches={[
 *     { type: 'choose', label: 'Choose', description: 'Pick element i' },
 *     { type: 'recurse', label: 'Recurse', description: 'Move to next' },
 *     { type: 'undo', label: 'Undo', description: 'Backtrack' }
 *   ]}
 *   complexity={{ time: 'O(n · 2^n)', space: 'O(n) stack + O(n · 2^n) output' }}
 * />
 */

export default function Approaches({ approaches = [], complexity = null }) {
  const stepTypeStyles = {
    choose: {
      borderColor: '#408A71',
      iconBg: '#408A71',
      iconColor: '#B0E4CC',
    },
    recurse: {
      borderColor: 'var(--color-warning)',
      iconBg: '#fef3c7',
      iconColor: '#92400e',
    },
    undo: {
      borderColor: 'var(--color-error)',
      iconBg: '#fee2e2',
      iconColor: '#991b1b',
    },
    base: {
      borderColor: '#10b981',
      iconBg: '#d1fae5',
      iconColor: '#065f46',
    },
    prune: {
      borderColor: '#f59e0b',
      iconBg: '#fef3c7',
      iconColor: '#92400e',
    },
  }

  return (
    <div className="card">
      <h2>Approaches</h2>
      <div className="cs-bt-steps">
        {approaches.map((approach, idx) => {
          const style = stepTypeStyles[approach.type] || stepTypeStyles.choose
          return (
            <div
              key={idx}
              className={`cs-bt-step cs-${approach.type}`}
              style={{ borderLeft: `3px solid ${style.borderColor}` }}
            >
              <div
                className="cs-bt-icon"
                style={{
                  background: style.iconBg,
                  color: style.iconColor,
                }}
              >
                {approach.icon || idx + 1}
              </div>
              <div>
                {approach.label && <strong>{approach.label}:</strong>} {approach.description}
              </div>
            </div>
          )
        })}
      </div>

      {complexity && (
        <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 13 }}>
          {complexity.time && <div><strong>Time:</strong> {complexity.time}</div>}
          {complexity.space && <div><strong>Space:</strong> {complexity.space}</div>}
        </div>
      )}
    </div>
  )
}
