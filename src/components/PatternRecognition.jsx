/**
 * PatternRecognition Component
 * Displays algorithm pattern recognition information in a card format.
 *
 * Usage:
 * <PatternRecognition
 *   patternName="Backtracking — Subset / Power Set"
 *   description="Every element has an independent binary choice (in/out). Tree width doubles at each level. Similar problems: Subsets II, Target Sum, Partition Equal Subset Sum."
 * />
 */

export default function PatternRecognition({ patternName = '', description = '' }) {
  return (
    <div className="card">
      <h2>Pattern Recognition</h2>
      {patternName && (
        <p style={{ fontSize: 13 }}>
          <strong>{patternName}</strong>
        </p>
      )}
      {description && (
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {description}
        </p>
      )}
    </div>
  )
}
