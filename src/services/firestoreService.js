import { db } from '../config/firebase'
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'

/**
 * Save calendar completion status to Firestore
 * @param {string} userId - The user's ID
 * @param {string} calendarId - Calendar identifier (e.g., '30', '45', '60', '90')
 * @param {Set} completedDays - Set of completed day numbers
 */
export async function saveCalendarStatus(userId, calendarId, completedDays) {
  try {
    if (!db) {
      console.warn('Firestore not configured. Progress not saved to cloud.')
      return false
    }
    
    const docRef = doc(db, 'users', userId, 'calendars', calendarId)
    const completedArray = Array.from(completedDays)
    
    await setDoc(docRef, {
      calendarId,
      completedDays: completedArray,
      lastUpdated: new Date().toISOString(),
    }, { merge: true })
    
    return true
  } catch (error) {
    console.error('Error saving calendar status:', error)
    return false
  }
}

/**
 * Load calendar completion status from Firestore
 * @param {string} userId - The user's ID
 * @param {string} calendarId - Calendar identifier (e.g., '30', '45', '60', '90')
 * @returns {Set} Set of completed day numbers
 */
export async function getCalendarStatus(userId, calendarId) {
  try {
    if (!db) {
      return new Set()
    }
    
    const docRef = doc(db, 'users', userId, 'calendars', calendarId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const { completedDays = [] } = docSnap.data()
      return new Set(completedDays)
    }
    
    return new Set()
  } catch (error) {
    console.error('Error loading calendar status:', error)
    return new Set()
  }
}

/**
 * Get all calendars for a user with their completion status
 * @param {string} userId - The user's ID
 * @returns {Array} Array of calendar status objects
 */
export async function getAllUserCalendars(userId) {
  try {
    if (!db) {
      return []
    }
    
    const calendarsRef = collection(db, 'users', userId, 'calendars')
    const querySnapshot = await getDocs(calendarsRef)
    
    const calendars = []
    querySnapshot.forEach((doc) => {
      calendars.push(doc.data())
    })
    
    return calendars
  } catch (error) {
    console.error('Error loading all calendars:', error)
    return []
  }
}

/**
 * Update user profile with preferred calendar settings
 * @param {string} userId - The user's ID
 * @param {Object} profileData - Profile data including preferences
 */
export async function updateUserProfile(userId, profileData) {
  try {
    if (!db) {
      console.warn('Firestore not configured. Profile not updated.')
      return false
    }
    
    const docRef = doc(db, 'users', userId)
    
    await setDoc(docRef, {
      ...profileData,
      updatedAt: new Date().toISOString(),
    }, { merge: true })
    
    return true
  } catch (error) {
    console.error('Error updating user profile:', error)
    return false
  }
}

/**
 * Get user profile
 * @param {string} userId - The user's ID
 */
export async function getUserProfile(userId) {
  try {
    if (!db) {
      return null
    }
    
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data()
    }
    
    return null
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}
