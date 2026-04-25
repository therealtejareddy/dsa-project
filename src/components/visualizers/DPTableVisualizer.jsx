/**
 * DPTableVisualizer
 * Displays dynamic programming table with step-by-step building
 * 
 * Props:
 *   - dpTable: Array of DP values
 *   - currentIndex: Currently being computed index
 *   - n: Input size
 *   - recurrence: Formula string (e.g., "dp[i] = dp[i-1] + dp[i-2]")
 *   - description: Current phase description
 */
export default function DPTableVisualizer({
  dpTable = [],
  currentIndex = -1,
  n = 0,
  recurrence = '',
  description = '',
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* DP Table Grid */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 8,
        padding: 16,
        overflow: 'auto',
      }}>
        <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 12, color: 'rgba(176, 228, 204, 0.7)' }}>
          📊 Dynamic Programming Table
        </p>

        {/* Table Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(n + 1, 12)}, 1fr)`,
          gap: 6,
          marginBottom: 12,
        }}>
          {/* Header row */}
          <div style={{
            gridColumn: '1 / -1',
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(n + 1, 12)}, 1fr)`,
            gap: 6,
            marginBottom: 6,
          }}>
            {dpTable.slice(0, Math.min(n + 1, 12)).map((_, idx) => (
              <div
                key={`header-${idx}`}
                style={{
                  padding: '6px 4px',
                  textAlign: 'center',
                  fontSize: 9,
                  fontFamily: 'monospace',
                  color: 'rgba(176, 228, 204, 0.6)',
                  fontWeight: 600,
                }}
              >
                i={idx}
              </div>
            ))}
          </div>

          {/* Values row */}
          <div style={{
            gridColumn: '1 / -1',
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(n + 1, 12)}, 1fr)`,
            gap: 6,
          }}>
            {dpTable.slice(0, Math.min(n + 1, 12)).map((val, idx) => {
              const isActive = idx === currentIndex
              const isComputed = idx < currentIndex || currentIndex === -1
              
              return (
                <div
                  key={`cell-${idx}`}
                  style={{
                    padding: '10px 6px',
                    background: isActive ? '#ea8c55' : isComputed ? '#6366f1' : 'rgba(99, 102, 241, 0.3)',
                    border: isActive ? '2px solid #f97316' : '1px solid rgba(99, 102, 241, 0.5)',
                    borderRadius: 6,
                    textAlign: 'center',
                    fontWeight: 700,
                    color: isActive || isComputed ? '#000' : 'rgba(176, 228, 204, 0.6)',
                    fontSize: 12,
                    fontFamily: 'monospace',
                    transition: 'all 0.2s',
                  }}
                >
                  {val || '—'}
                </div>
              )
            })}
          </div>
        </div>

        {n > 12 && (
          <p style={{ fontSize: 10, color: 'rgba(176, 228, 204, 0.5)', textAlign: 'center', marginTop: 8 }}>
            Showing first 12 values...
          </p>
        )}
      </div>

      {/* Recurrence Formula */}
      {recurrence && (
        <div style={{
          background: 'rgba(99, 102, 241, 0.2)',
          border: '1px solid var(--color-primary)',
          borderRadius: 8,
          padding: 12,
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: 'var(--color-primary)' }}>
            📐 Recurrence Formula
          </p>
          <p style={{
            fontSize: 12,
            fontFamily: 'monospace',
            color: 'var(--color-accent)',
            fontWeight: 600,
          }}>
            {recurrence}
          </p>
        </div>
      )}

      {/* Complexity Info */}
      <div style={{
        background: 'rgba(34, 197, 94, 0.2)',
        border: '1px solid var(--color-success)',
        borderRadius: 8,
        padding: 12,
      }}>
        <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: 'var(--color-success)' }}>
          ✅ Complexity
        </p>
        <div style={{ fontSize: 10, color: 'rgba(176, 228, 204, 0.85)' }}>
          <div><span style={{ color: '#22c55e', fontWeight: 600 }}>Time:</span> O(n) — compute each cell once</div>
          <div><span style={{ color: '#22c55e', fontWeight: 600 }}>Space:</span> O(n) — full DP table</div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 8,
          padding: 10,
          fontSize: 11,
          color: 'rgba(176, 228, 204, 0.8)',
          fontStyle: 'italic',
        }}>
          {description}
        </div>
      )}
    </div>
  )
}
