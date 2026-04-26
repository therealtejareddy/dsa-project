import { useState, useEffect } from 'react'
import { getProblemNote, saveProblemNote } from '../services/firestoreService'

/**
 * useProblemNotes — loads + saves per-problem notes from Firebase.
 *
 * @param {string}   patternKey  - Firestore collection key (e.g. 'fixed', 'dynamic')
 * @param {Array}    problemList - Static array of problem definitions
 * @param {string}   userId      - From AuthContext: user?.uid
 *
 * Returns:
 *   problems         - problem list enriched with userNote + completed fields
 *   handleSaveNote   - call with an updated problem object to persist it
 */
export function useProblemNotes(patternKey, problemList, userId) {
  const [problems, setProblems] = useState([])

  useEffect(() => {
    const load = async () => {
      if (!userId) {
        setProblems(problemList.map(p => ({ ...p, userNote: '', completed: false })))
        return
      }
      const withNotes = await Promise.all(
        problemList.map(async (p) => {
          const saved = await getProblemNote(userId, patternKey, p.id)
          return {
            ...p,
            userNote:  saved?.userNote  || '',
            completed: saved?.completed || false,
          }
        })
      )
      setProblems(withNotes)
    }
    load()
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveNote = async (updated) => {
    setProblems(prev => prev.map(p => p.id === updated.id ? updated : p))
    if (userId) await saveProblemNote(userId, patternKey, updated)
  }

  return { problems, handleSaveNote }
}
