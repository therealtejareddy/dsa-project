import { useState } from 'react'
import '../styles/ProblemCard.css'

export default function ProblemCard({ problem, onSaveNote, userId }) {
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteText, setNoteText] = useState(problem.userNote || '')
  const [isCompleted, setIsCompleted] = useState(problem.completed || false)

  const handleSaveNote = async () => {
    if (onSaveNote) {
      await onSaveNote({
        ...problem,
        userNote: noteText,
        completed: isCompleted,
      })
    }
    setIsEditingNote(false)
  }

  const handleToggleComplete = () => {
    setIsCompleted(!isCompleted)
    if (onSaveNote) {
      onSaveNote({
        ...problem,
        userNote: noteText,
        completed: !isCompleted,
      })
    }
  }

  return (
    <div className={`problem-card ${isCompleted ? 'completed' : ''}`}>
      <div className="problem-header">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggleComplete}
          className="problem-checkbox"
        />
        <div className="problem-title-section">
          <h3 className="problem-title">{problem.title}</h3>
          {problem.leetcodeLink && (
            <a
              href={problem.leetcodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="leetcode-link"
            >
              LeetCode ↗
            </a>
          )}
        </div>
        <span className={`difficulty ${problem.difficulty?.toLowerCase()}`}>
          {problem.difficulty}
        </span>
      </div>

      <p className="problem-description">{problem.description}</p>

      <div className="problem-tags">
        {problem.topics?.map(topic => (
          <span key={topic} className="tag">
            {topic}
          </span>
        ))}
      </div>

      <div className="problem-notes-section">
        {isEditingNote ? (
          <div className="note-editor">
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add your notes here..."
              className="note-textarea"
            />
            <div className="note-actions">
              <button
                onClick={handleSaveNote}
                className="btn-save-note"
              >
                Save Note
              </button>
              <button
                onClick={() => setIsEditingNote(false)}
                className="btn-cancel-note"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {noteText ? (
              <div className="note-display">
                <p className="note-label">📝 Your Note:</p>
                <p className="note-text">{noteText}</p>
              </div>
            ) : (
              <p className="no-note">No notes yet</p>
            )}
            <button
              onClick={() => setIsEditingNote(true)}
              className="btn-edit-note"
            >
              {noteText ? '✏️ Edit Note' : '➕ Add Note'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
