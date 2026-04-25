/**
 * RecursionCallVisualizer
 * Displays recursion call statistics and exponential growth warnings
 * 
 * Props:
 *   - callCount: Number of recursive calls made
 *   - maxCalls: Base 2^n maximum possible calls
 *   - n: Input size
 *   - showWarning: Display redundancy warning
 *   - description: Optional text description of current phase
 */
export default function RecursionCallVisualizer({
  callCount = 0,
  maxCalls = 0,
  n = 0,
  showWarning = false,
  description = '',
}) {
  const percentage = maxCalls > 0 ? Math.min((callCount / maxCalls) * 100, 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Call Counter */}
      <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: 8, padding: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: 'rgba(176, 228, 204, 0.7)' }}>
          Recursive Calls Made:
        </p>
        <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-accent)', marginBottom: 8 }}>
          {callCount}
        </p>
        <div style={{
          width: '100%',
          height: 6,
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #6366f1, #a855f7)',
            transition: 'width 0.3s ease',
          }} />
        </div>
        <p style={{ fontSize: 11, color: 'rgba(176, 228, 204, 0.6)', marginTop: 6 }}>
          For n={n}: O(2ⁿ) ≈ {maxCalls} calls
        </p>
      </div>

      {/* Redundancy Warning */}
      {showWarning && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid var(--color-error)',
          borderRadius: 8,
          padding: 12,
        }}>
          <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-error)' }}>
            ⚠ Massive Redundancy
          </p>
          <p style={{ fontSize: 11, color: 'rgba(176, 228, 204, 0.8)' }}>
            Many subproblems computed repeatedly. Same calls stack recurs in every branch! This is why memoization/DP required.
          </p>
        </div>
      )}

      {/* Exponential Growth Tree Diagram */}
      <div style={{
        background: 'rgba(64, 138, 113, 0.2)',
        border: '1px solid var(--color-primary)',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
      }}>
        <svg width="100%" height="80" viewBox="0 0 200 80" style={{ marginTop: 8 }}>
          {/* Tree structure visualization */}
          <circle cx="100" cy="10" r="5" fill="#6366f1" />
          
          {/* Level 1 */}
          <line x1="100" y1="15" x2="60" y2="30" stroke="#6366f1" strokeWidth="1" />
          <line x1="100" y1="15" x2="140" y2="30" stroke="#6366f1" strokeWidth="1" />
          <circle cx="60" cy="35" r="4" fill="#a855f7" />
          <circle cx="140" cy="35" r="4" fill="#a855f7" />
          
          {/* Level 2 - left branch */}
          <line x1="60" y1="39" x2="40" y2="50" stroke="#a855f7" strokeWidth="1" strokeDasharray="2" />
          <line x1="60" y1="39" x2="80" y2="50" stroke="#a855f7" strokeWidth="1" strokeDasharray="2" />
          <circle cx="40" cy="54" r="3" fill="#ec4899" opacity="0.7" />
          <circle cx="80" cy="54" r="3" fill="#ec4899" opacity="0.7" />
          
          {/* Level 2 - right branch */}
          <line x1="140" y1="39" x2="120" y2="50" stroke="#a855f7" strokeWidth="1" strokeDasharray="2" />
          <line x1="140" y1="39" x2="160" y2="50" stroke="#a855f7" strokeWidth="1" strokeDasharray="2" />
          <circle cx="120" cy="54" r="3" fill="#ec4899" opacity="0.7" />
          <circle cx="160" cy="54" r="3" fill="#ec4899" opacity="0.7" />

          {/* Labels */}
          <text x="100" y="72" fontSize="10" textAnchor="middle" fill="rgba(176, 228, 204, 0.7)">
            Exponential branching: 2^1, 2^2, ...
          </text>
        </svg>
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
