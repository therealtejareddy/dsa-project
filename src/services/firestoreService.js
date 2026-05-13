import { db } from "../config/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

/**
 * Save calendar completion status to Firestore
 * @param {string} userId - The user's ID
 * @param {string} calendarId - Calendar identifier (e.g., '30', '45', '60', '90')
 * @param {Set} completedDays - Set of completed day numbers
 */
export async function saveCalendarStatus(userId, calendarId, completedDays) {
  try {
    if (!db) {
      console.warn("Firestore not configured. Progress not saved to cloud.");
      return false;
    }

    const docRef = doc(db, "users", userId, "calendars", calendarId);
    const completedArray = Array.from(completedDays);

    await setDoc(
      docRef,
      {
        calendarId,
        completedDays: completedArray,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true },
    );

    return true;
  } catch (error) {
    console.error("Error saving calendar status:", error);
    return false;
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
      return new Set();
    }

    const docRef = doc(db, "users", userId, "calendars", calendarId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { completedDays = [] } = docSnap.data();
      return new Set(completedDays);
    }

    return new Set();
  } catch (error) {
    console.error("Error loading calendar status:", error);
    return new Set();
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
      return [];
    }

    const calendarsRef = collection(db, "users", userId, "calendars");
    const querySnapshot = await getDocs(calendarsRef);

    const calendars = [];
    querySnapshot.forEach((doc) => {
      calendars.push(doc.data());
    });

    return calendars;
  } catch (error) {
    console.error("Error loading all calendars:", error);
    return [];
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
      console.warn("Firestore not configured. Profile not updated.");
      return false;
    }

    const docRef = doc(db, "users", userId);

    await setDoc(
      docRef,
      {
        ...profileData,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
}

/**
 * Get user profile
 * @param {string} userId - The user's ID
 */
export async function getUserProfile(userId) {
  try {
    if (!db) {
      return null;
    }

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }

    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

/**
 * Save problem note and progress to Firestore
 * @param {string} userId - The user's ID
 * @param {string} patternType - Pattern type (e.g., 'fixed', 'dynamic')
 * @param {Object} problemData - Problem data with note and completion status
 */
export async function saveProblemNote(userId, patternType, problemData) {
  try {
    if (!db || !userId) {
      console.warn("Firestore not configured or userId missing.");
      return false;
    }

    const docRef = doc(
      db,
      "users",
      userId,
      "problems",
      `${patternType}_${problemData.id}`,
    );

    await setDoc(
      docRef,
      {
        id: problemData.id,
        title: problemData.title,
        patternType,
        userNote: problemData.userNote || "",
        completed: problemData.completed || false,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true },
    );

    return true;
  } catch (error) {
    console.error("Error saving problem note:", error);
    return false;
  }
}

/**
 * Get problem note from Firestore
 * @param {string} userId - The user's ID
 * @param {string} patternType - Pattern type (e.g., 'fixed', 'dynamic')
 * @param {string} problemId - Problem ID
 */
export async function getProblemNote(userId, patternType, problemId) {
  try {
    if (!db || !userId) {
      return null;
    }

    const docRef = doc(
      db,
      "users",
      userId,
      "problems",
      `${patternType}_${problemId}`,
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }

    return null;
  } catch (error) {
    console.error("Error loading problem note:", error);
    return null;
  }
}

/**
 * Update only the completed status of a problem in Firestore
 * @param {string} userId - The user's ID
 * @param {string} patternType - Pattern type (e.g., 'fixed', 'dynamic')
 * @param {string} problemId - Problem ID
 * @param {boolean} completed - Whether the problem is completed
 */
export async function updateProblemCompleted(
  userId,
  patternType,
  problemId,
  completed,
) {
  try {
    if (!db || !userId) {
      console.warn("Firestore not configured or userId missing.");
      return false;
    }

    const docRef = doc(
      db,
      "users",
      userId,
      "problems",
      `${patternType}_${problemId}`,
    );
    await setDoc(
      docRef,
      {
        id: problemId,
        patternType,
        completed,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true },
    );

    return true;
  } catch (error) {
    console.error("Error updating problem completed status:", error);
    return false;
  }
}

/**
 * Get all problems for a pattern type with user notes
 * @param {string} userId - The user's ID
 * @param {string} patternType - Pattern type (e.g., 'fixed', 'dynamic')
 */
export async function getPatternProblems(userId, patternType) {
  try {
    if (!db || !userId) {
      return [];
    }

    const problemsRef = collection(db, "users", userId, "problems");
    const q = query(problemsRef, where("patternType", "==", patternType));
    const querySnapshot = await getDocs(q);

    const problems = [];
    querySnapshot.forEach((doc) => {
      problems.push(doc.data());
    });

    return problems;
  } catch (error) {
    console.error("Error loading pattern problems:", error);
    return [];
  }
}

/**
 * Save the set of completed problem IDs (global, cross-calendar).
 * Stored under users/{uid}/progress/problems
 */
export async function saveCompletedProblems(userId, completedProblems) {
  try {
    if (!db) return false;
    const docRef = doc(db, "users", userId, "progress", "problems");
    await setDoc(
      docRef,
      {
        completedIds: Array.from(completedProblems),
        lastUpdated: new Date().toISOString(),
      },
      { merge: true },
    );
    return true;
  } catch (error) {
    console.error("Error saving completed problems:", error);
    return false;
  }
}

/**
 * Load the set of completed problem IDs (global, cross-calendar).
 */
export async function getCompletedProblems(userId) {
  try {
    if (!db) return new Set();
    const docRef = doc(db, "users", userId, "progress", "problems");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return new Set(snap.data().completedIds ?? []);
    }
    return new Set();
  } catch (error) {
    console.error("Error loading completed problems:", error);
    return new Set();
  }
}

/**
 * Save system design calendar data to Firestore
 * Stores day notes, topic notes, topic completion, and day completion in dedicated subcollection
 */
export async function saveSystemDesignData(userId, calendarId, data) {
  try {
    if (!db || !userId) {
      console.warn("Firestore not configured.");
      return false;
    }

    const docRef = doc(db, "users", userId, "systemDesign", calendarId);

    await setDoc(
      docRef,
      {
        calendarId,
        dayNotes: data.dayNotes || {},
        topicNotes: data.topicNotes || {},
        completedTopics: Array.from(data.completedTopics || []),
        completedDays: Array.from(data.completedDays || []),
        lastUpdated: new Date().toISOString(),
      },
      { merge: true },
    );

    return true;
  } catch (error) {
    console.error("Error saving system design data:", error);
    return false;
  }
}

/**
 * Load system design calendar data from Firestore
 */
export async function getSystemDesignData(userId, calendarId) {
  try {
    if (!db || !userId) {
      return {
        dayNotes: {},
        topicNotes: {},
        completedTopics: new Set(),
        completedDays: new Set(),
      };
    }

    const docRef = doc(db, "users", userId, "systemDesign", calendarId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        dayNotes: data.dayNotes || {},
        topicNotes: data.topicNotes || {},
        completedTopics: new Set(data.completedTopics || []),
        completedDays: new Set(data.completedDays || []),
      };
    }

    return {
      dayNotes: {},
      topicNotes: {},
      completedTopics: new Set(),
      completedDays: new Set(),
    };
  } catch (error) {
    console.error("Error loading system design data:", error);
    return {
      dayNotes: {},
      topicNotes: {},
      completedTopics: new Set(),
      completedDays: new Set(),
    };
  }
}
