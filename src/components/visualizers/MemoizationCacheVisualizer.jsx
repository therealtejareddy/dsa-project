/**
 * MemoizationCacheVisualizer
 * Displays memoization cache state with call counter comparison
 * 
 * Props:
 *   - callCount: Number of recursive calls with memoization
 *   - memo: Object containing cached values {key: value}
 *   - n: Input size
 *   - bruthCallCount: Brute force equivalent calls for comparison
 *   - description: Optional text description
 */
export default function MemoizationCacheVisualizer({
  callCount = 0,
  memo = {},
  n = 0,
  bruteCallCount = 0,
  description = '',
}) {
  const improvement = bruteCallCount > 0 ? ((bruteCallCount - callCount) / bruteCallCount * 100).toFixed(1) : 0
  const memoKeys = Object.entries(memo || {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Call Counter with Improvement */}
      <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: 8, padding: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: 'rgba(176, 228, 204, 0.7)' }}>
          Recursive Calls:
        </p>
        <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-accent)', marginBottom: 8 }}>
          {callCount}
        </p>
        <p style={{ fontSize: 11, color: 'rgba(176, 228, 204, 0.6)' }}>
          With memoization: O(n)
        </p>
        {bruteCallCount > 0 && (
          <p style={{ fontSize: 11, color: '#22c55e', marginTop: 6, fontWeight: 600 }}>
            ✅ Improvement: {improvement}% fewer calls (brute: {bruteCallCount})
          </p>
        )}
      </div>

      {/* Memoization Cache */}
      <div style={{
        background: 'rgba(34, 197, 94, 0.2)',
        border: '1px solid var(--color-success)',
        borderRadius: 8,
        padding: 12,
      }}>
        <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, color: 'var(--color-success)' }}>
          💾 Memoization Cache
        </p>
        
        {memoKeys.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
            gap: 6,
          }}>
            {memoKeys.map(([k, v]) => (
              <div
                key={k}
                style={{
                  padding: '6px 8px',
                  background: 'rgba(52, 211, 153, 0.3)',
                  border: '1px solid rgba(52, 211, 153, 0.5)',
                  borderRadius: 4,
                  textAlign: 'center',
                  fontSize: 10,
                  fontFamily: 'monospace',
                  color: 'var(--color-accent)',
                  fontWeight: 600,
                }}
              >
                <div>{k}</div>
                <div style={{ fontSize: 9, opacity: 0.8 }}>→ {v}</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 10, color: 'rgba(176, 228, 204, 0.6)' }}>
            Initializing cache...
          </p>
        )}
      </div>

      {/* Strategy Explanation */}
      <div style={{
        background: 'rgba(99, 102, 241, 0.2)',
        border: '1px solid var(--color-primary)',
        borderRadius: 8,
        padding: 12,
      }}>
        <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: 'var(--color-primary)' }}>
          📌 How Memoization Works
        </p>
        <ul style={{
          fontSize: 10,
          color: 'rgba(176, 228, 204, 0.85)',
          margin: 0,
          paddingLeft: 16,
        }}>
          <li>Each unique subproblem solve(k) computed only once</li>
          <li>Result cached → future calls return cached value instantly</li>
          <li>Avoids redundant recalculation across branches</li>
          <li>Trade-off: O(n) extra space for cache</li>
        </ul>
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
