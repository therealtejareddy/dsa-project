import problemsData from '../data/problems.json'

const problemsById = Object.fromEntries(
  problemsData.problems.map(p => [p.id, p])
)

/**
 * Resolve an array of problem IDs (numbers) or full problem objects (legacy).
 * Returns an array of full problem objects.
 */
export function resolveProblems(problems = []) {
  return problems.map(p => {
    if (typeof p === 'number') return problemsById[p] ?? null
    return p // already a full object (legacy support)
  }).filter(Boolean)
}

export { problemsById }
