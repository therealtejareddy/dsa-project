/**
 * InterviewNotes Component
 * Displays interview-relevant information structured in three sections:
 * - What interviewers look for
 * - Common traps
 * - Follow-ups
 *
 * Usage:
 * <InterviewNotes
 *   whatToLookFor={['Point 1', 'Point 2']}
 *   commonTraps={['Trap 1', 'Trap 2']}
 *   followUps={['Problem 1', 'Problem 2']}
 * />
 */

export default function InterviewNotes({ whatToLookFor = [], commonTraps = [], followUps = [] }) {
  return (
    <div className="card">
      <h2>Interview Notes</h2>

      {whatToLookFor.length > 0 && (
        <div className="info-box" style={{ margin: '0 0 10px' }}>
          <strong>What interviewers look for</strong>
          <ul style={{ marginTop: 6, paddingLeft: 18, fontSize: 13 }}>
            {whatToLookFor.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {commonTraps.length > 0 && (
        <div className="info-box warning" style={{ margin: '0 0 10px' }}>
          <strong>Common traps</strong>
          <ul style={{ marginTop: 6, paddingLeft: 18, fontSize: 13 }}>
            {commonTraps.map((trap, idx) => (
              <li key={idx}>{trap}</li>
            ))}
          </ul>
        </div>
      )}

      {followUps.length > 0 && (
        <div className="info-box info">
          <strong>Follow-ups</strong>
          <ul style={{ marginTop: 6, paddingLeft: 18, fontSize: 13 }}>
            {followUps.map((followUp, idx) => (
              <li key={idx}>{followUp}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
