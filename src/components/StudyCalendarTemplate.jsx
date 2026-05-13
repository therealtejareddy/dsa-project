import { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  saveCalendarStatus,
  getCalendarStatus,
  saveCompletedProblems,
  getCompletedProblems,
  saveProblemNote as saveProblemNoteToFB,
  getProblemNote as getProblemNoteFromFB,
  getPatternProblems,
  updateProblemCompleted,
} from "../services/firestoreService";
import { resolveProblems } from "../utils/problems";

export const CATEGORY_COLORS = {
  Array: { bg: "rgba(99, 102, 241, 0.15)", border: "#6366f1", text: "#a5b4fc" },
  "Two Pointers": {
    bg: "rgba(20, 184, 166, 0.12)",
    border: "#14b8a6",
    text: "#5eead4",
  },
  "Sliding Window": {
    bg: "rgba(6, 182, 212, 0.12)",
    border: "#06b6d4",
    text: "#67e8f9",
  },
  Stack: {
    bg: "rgba(100, 116, 139, 0.15)",
    border: "#64748b",
    text: "#cbd5e1",
  },
  "Binary Search": {
    bg: "rgba(139, 92, 246, 0.15)",
    border: "#8b5cf6",
    text: "#c4b5fd",
  },
  "Bit Manipulation": {
    bg: "rgba(251, 146, 60, 0.15)",
    border: "#fb923c",
    text: "#fed7aa",
  },
  "Dynamic Programming": {
    bg: "rgba(16, 185, 129, 0.15)",
    border: "#10b981",
    text: "#6ee7b7",
  },
  DP: { bg: "rgba(16, 185, 129, 0.15)", border: "#10b981", text: "#6ee7b7" },
  String: {
    bg: "rgba(245, 158, 11, 0.15)",
    border: "#f59e0b",
    text: "#fcd34d",
  },
  Tree: { bg: "rgba(236, 72, 153, 0.15)", border: "#ec4899", text: "#f9a8d4" },
  Interval: {
    bg: "rgba(168, 85, 247, 0.15)",
    border: "#a855f7",
    text: "#d8b4fe",
  },
  "Linked List": {
    bg: "rgba(34, 211, 238, 0.12)",
    border: "#22d3ee",
    text: "#a5f3fc",
  },
  Matrix: {
    bg: "rgba(132, 204, 22, 0.12)",
    border: "#84cc16",
    text: "#d9f99d",
  },
  "Math & Geometry": {
    bg: "rgba(244, 114, 182, 0.12)",
    border: "#f472b6",
    text: "#fbcfe8",
  },
  Graph: { bg: "rgba(59, 130, 246, 0.15)", border: "#3b82f6", text: "#93c5fd" },
  "Advanced Graph": {
    bg: "rgba(30, 64, 175, 0.18)",
    border: "#1e40af",
    text: "#93c5fd",
  },
  Heap: { bg: "rgba(239, 68, 68, 0.12)", border: "#ef4444", text: "#fca5a5" },
  Trie: { bg: "rgba(249, 115, 22, 0.12)", border: "#f97316", text: "#fdba74" },
  Backtracking: {
    bg: "rgba(234, 179, 8, 0.12)",
    border: "#eab308",
    text: "#fef08a",
  },
  Greedy: {
    bg: "rgba(74, 222, 128, 0.12)",
    border: "#4ade80",
    text: "#bbf7d0",
  },
};

export const DIFF_COLOR = {
  Easy: { color: "#34d399", bg: "rgba(52, 211, 153, 0.1)" },
  Medium: { color: "#fbbf24", bg: "rgba(251, 191, 36, 0.1)" },
  Hard: { color: "#f87171", bg: "rgba(248, 113, 113, 0.1)" },
};

const DEFAULT_WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function dayPrimaryCategory(dayEntry) {
  return dayEntry.problems?.length > 0 ? dayEntry.problems[0].category : null;
}

function buildWeeks(totalDays) {
  const rows = Math.ceil(totalDays / 7);
  const weeks = [];
  for (let w = 0; w < rows; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const n = w * 7 + d + 1;
      week.push(n <= totalDays ? n : null);
    }
    weeks.push(week);
  }
  return weeks;
}

/**
 * Reusable study calendar component.
 *
 * Props:
 *   title          {string}   Page heading
 *   subtitle       {string}   Sub-heading below the title
 *   headerGradient {string}   CSS `background` value for the header section
 *   progressGradient {string} CSS `background` value for the progress bar fill
 *   days           {Array}    Array of { day: number, label?: string, problems: Problem[] }
 *                             Problem: { num, title, path, difficulty, category }
 *   totalDays      {number}   Total number of days in the plan
 *   breadcrumbs    {Array}    [{ label: string, to: string }] back-links shown in header
 *   weekDayLabels  {string[]} Optional 7-element array, defaults to Mon–Sun
 *   extraStats     {Array}    Optional extra stat chips [{ label, value, color }]
 */
export default function StudyCalendarTemplate({
  title,
  subtitle,
  headerGradient = "linear-gradient(135deg, var(--color-primary), var(--color-bg-darker))",
  progressGradient = "linear-gradient(90deg, #10b981, #34d399)",
  days = [],
  totalDays,
  breadcrumbs = [],
  weekDayLabels = DEFAULT_WEEK_DAYS,
  extraStats = [],
}) {
  const resolvedDays = useMemo(
    () => days.map((d) => ({ ...d, problems: resolveProblems(d.problems) })),
    [days],
  );
  const [completedDays, setCompletedDays] = useState(new Set());
  const [completedProblems, setCompletedProblems] = useState(new Set());
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [problemNotes, setProblemNotes] = useState({});
  const [dayNotes, setDayNotes] = useState({});
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [editingDayNote, setEditingDayNote] = useState(false);
  const [dayNoteText, setDayNoteText] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { user } = useContext(AuthContext);

  // Load calendar status from Firestore when component mounts or user changes
  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        try {
          setLoading(true);
          const calendarId = String(totalDays);
          const [savedDays, savedProblems, allProblemNotes, allDayNotes] =
            await Promise.all([
              getCalendarStatus(user.uid, calendarId),
              getCompletedProblems(user.uid),
              getPatternProblems(user.uid, "calendar"),
              getPatternProblems(user.uid, "dayNotes"),
            ]);
          setCompletedDays(savedDays);
          setCompletedProblems(savedProblems);
          // Convert problem notes array to object format (already filtered by calendar via patternType)
          const problemNotesObj = {};
          allProblemNotes.forEach((pn) => {
            problemNotesObj[pn.id] = pn.userNote || "";
          });
          setProblemNotes(problemNotesObj);
          // Convert day notes array to object format (filter by current calendar)
          const dayNotesObj = {};
          allDayNotes.forEach((dn) => {
            // Only include notes for this calendar (e.g., '30-1', '30-2' for 30-day calendar)
            if (dn.id.startsWith(`${calendarId}-`)) {
              dayNotesObj[dn.id] = dn.userNote || "";
            }
          });
          setDayNotes(dayNotesObj);
        } catch (error) {
          console.error("Failed to load calendar progress:", error);
          // Continue without Firebase sync
        } finally {
          setLoading(false);
          setIsInitialLoad(false);
        }
      } else {
        setCompletedDays(new Set());
        setLoading(false);
        setIsInitialLoad(false);
      }
    };
    loadProgress();
  }, [user, totalDays]);

  // Save calendar day status to Firestore whenever completedDays changes
  useEffect(() => {
    if (user && completedDays.size >= 0) {
      const saveProgress = async () => {
        try {
          const calendarId = String(totalDays);
          await saveCalendarStatus(user.uid, calendarId, completedDays);
        } catch (error) {
          console.error("Failed to save calendar progress:", error);
        }
      };
      const timer = setTimeout(saveProgress, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, completedDays, totalDays]);

  // Save completed problems to Firestore (global, cross-calendar)
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      saveCompletedProblems(user.uid, completedProblems).catch((e) =>
        console.error("Failed to save completed problems:", e),
      );
    }, 1000);
    return () => clearTimeout(timer);
  }, [user, completedProblems]);

  const toggleProblemComplete = (problemId) => {
    // Simply toggle this problem, don't cascade to other problems in the day
    setCompletedProblems((prev) => {
      const next = new Set(prev);
      const newCompleted = !next.has(problemId);
      if (newCompleted) {
        next.add(problemId);
      } else {
        next.delete(problemId);
      }
      // Persist completed status immediately to Firestore
      if (user) {
        updateProblemCompleted(
          user.uid,
          "calendar",
          String(problemId),
          newCompleted,
        ).catch((e) => console.error("Failed to update problem completed:", e));
      }
      return next;
    });
  };

  // Auto-mark day as complete if all its problems are completed
  // Only run after initial load to preserve saved calendar state
  useEffect(() => {
    if (isInitialLoad) return;

    setCompletedDays((prevDays) => {
      const nextDays = new Set(prevDays);

      for (const day of resolvedDays) {
        if (day.problems.length === 0) continue;

        const allProblemsInDayDone = day.problems.every((p) =>
          completedProblems.has(p.id),
        );
        if (allProblemsInDayDone) {
          nextDays.add(day.day);
        }
      }

      return nextDays;
    });
  }, [completedProblems, resolvedDays, isInitialLoad]);

  const toggleComplete = (day) => {
    // Toggle day completion and sync all problems in that day
    const dayEntry = resolvedDays.find((d) => d.day === day);
    if (!dayEntry || dayEntry.problems.length === 0) return;

    const willMarkDay = !completedDays.has(day);

    setCompletedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });

    // Sync problems: only mark all problems when marking the day (don't unmark on day unmark)
    setCompletedProblems((prev) => {
      const next = new Set(prev);
      if (willMarkDay) {
        dayEntry.problems.forEach((p) => next.add(p.id));
      }
      // Don't unmark problems when unmarking the day
      return next;
    });
  };

  const openProblemNoteEditor = (problemId, currentNote = "") => {
    setEditingNoteId(problemId);
    setNoteText(currentNote);
  };

  const saveProblemNote = () => {
    setProblemNotes((prev) => ({
      ...prev,
      [editingNoteId]: noteText,
    }));
    // Persist to Firestore using existing function
    if (user) {
      saveProblemNoteToFB(user.uid, "calendar", {
        id: editingNoteId,
        title: editingNoteId,
        userNote: noteText,
        completed: completedProblems.has(editingNoteId),
      }).catch((e) => console.error("Failed to save problem note:", e));
    }
    setEditingNoteId(null);
    setNoteText("");
  };

  const openDayNoteEditor = (day) => {
    setSelectedDay(day);
    setEditingDayNote(true);
    const dayKey = getDayNoteKey(day);
    setDayNoteText(dayNotes[dayKey] || "");
  };

  const saveDayNote = () => {
    const dayKey = getDayNoteKey(selectedDay);
    setDayNotes((prev) => ({
      ...prev,
      [dayKey]: dayNoteText,
    }));
    // Persist to Firestore using existing function
    if (user) {
      saveProblemNoteToFB(user.uid, "dayNotes", {
        id: dayKey,
        title: `Calendar ${totalDays} - Day ${selectedDay}`,
        userNote: dayNoteText,
        completed: false,
      }).catch((e) => console.error("Failed to save day note:", e));
    }
    setEditingDayNote(false);
    setDayNoteText("");
  };

  const getDayNoteKey = (dayNum) => `${totalDays}-${dayNum}`;

  const completedCount = completedDays.size;
  const progressPercent = Math.round((completedCount / totalDays) * 100);
  const selectedDayEntry = selectedDay
    ? resolvedDays.find((d) => d.day === selectedDay)
    : null;

  const allProblems = resolvedDays.flatMap((d) => d.problems);
  const WEEKS = buildWeeks(totalDays);

  const defaultStats = [
    { label: "Days Done", value: completedCount, color: "#34d399" },
    { label: "Remaining", value: totalDays - completedCount, color: "#fbbf24" },
    {
      label: "Problems Done",
      value: allProblems.filter((p) => completedProblems.has(p.id)).length,
      color: "#a78bfa",
    },
    {
      label: "Easy",
      value: allProblems.filter((p) => p.difficulty === "Easy").length,
      color: "#34d399",
    },
    {
      label: "Medium",
      value: allProblems.filter((p) => p.difficulty === "Medium").length,
      color: "#fbbf24",
    },
    {
      label: "Hard",
      value: allProblems.filter((p) => p.difficulty === "Hard").length,
      color: "#f87171",
    },
  ];
  const stats = [...defaultStats, ...extraStats];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg-darkest)",
        color: "var(--color-accent)",
        fontFamily: '"Segoe UI", sans-serif',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          background: headerGradient,
          padding: "40px 30px",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div style={{ maxWidth: 1450, margin: "0 auto" }}>
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 16,
                flexWrap: "wrap",
              }}
            >
              {breadcrumbs.map((b, i) => (
                <Link
                  key={i}
                  to={b.to}
                  style={{
                    color: "rgba(176, 228, 204, 0.6)",
                    textDecoration: "none",
                    fontSize: 13,
                  }}
                >
                  {b.label}
                </Link>
              ))}
            </div>
          )}

          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              margin: 0,
              marginBottom: 8,
            }}
          >
            {title}
          </h1>
          <p style={{ opacity: 0.8, fontSize: 16, margin: 0 }}>{subtitle}</p>

          {/* Progress bar */}
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
                fontSize: 13,
                color: "rgba(176, 228, 204, 0.8)",
              }}
            >
              <span>
                {completedCount} / {totalDays} days completed
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div
              style={{
                height: 10,
                background: "rgba(176, 228, 204, 0.15)",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPercent}%`,
                  background: progressGradient,
                  borderRadius: 10,
                  transition: "width 0.4s ease",
                }}
              />
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                gap: 24,
                marginTop: 16,
                flexWrap: "wrap",
              }}
            >
              {stats.map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div
                    style={{ fontSize: 22, fontWeight: 800, color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{ fontSize: 11, color: "rgba(176, 228, 204, 0.6)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1450, margin: "0 auto", padding: "40px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 32,
            alignItems: "start",
            overflow: "hidden",
          }}
        >
          {/* Calendar grid */}
          <div style={{ minWidth: 0, overflowX: "auto" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
              📆 Calendar View
            </h2>

            {/* Weekday headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 6,
                marginBottom: 6,
                minWidth: "min-content",
              }}
            >
              {weekDayLabels.map((d) => (
                <div
                  key={d}
                  style={{
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(176, 228, 204, 0.5)",
                    paddingBottom: 6,
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Rows */}
            {WEEKS.map((week, wi) => (
              <div
                key={wi}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 6,
                  marginBottom: 6,
                  minWidth: "min-content",
                }}
              >
                {week.map((dayNum, di) => {
                  if (!dayNum) return <div key={di} />;
                  const entry = resolvedDays.find((d) => d.day === dayNum);
                  const isCompleted = completedDays.has(dayNum);
                  const isSelected = selectedDay === dayNum;
                  const cat = dayPrimaryCategory(entry);
                  const catColor = cat ? CATEGORY_COLORS[cat] : null;
                  const isReview = entry?.problems?.length === 0;

                  return (
                    <div
                      key={dayNum}
                      onClick={() => setSelectedDay(isSelected ? null : dayNum)}
                      style={{
                        borderRadius: 10,
                        padding: "8px 6px",
                        cursor: "pointer",
                        background: isCompleted
                          ? "rgba(52, 211, 153, 0.12)"
                          : isReview
                            ? "rgba(176, 228, 204, 0.04)"
                            : isSelected
                              ? catColor?.bg || "rgba(176, 228, 204, 0.1)"
                              : "var(--color-bg-dark)",
                        border: `2px solid ${
                          isSelected
                            ? catColor?.border || "var(--color-primary)"
                            : isCompleted
                              ? "#34d399"
                              : isReview
                                ? "rgba(176, 228, 204, 0.15)"
                                : "var(--color-border)"
                        }`,
                        transition: "all 0.2s ease",
                        minHeight: 80,
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor =
                            catColor?.border || "var(--color-primary)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = `0 4px 16px ${catColor?.border || "rgba(64, 138, 113, 0.3)"}40`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = isCompleted
                            ? "#34d399"
                            : isReview
                              ? "rgba(176, 228, 204, 0.15)"
                              : "var(--color-border)";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                    >
                      {/* Day label row */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontSize: 11,
                            fontWeight: 700,
                            color: isCompleted
                              ? "#34d399"
                              : "rgba(176, 228, 204, 0.9)",
                          }}
                        >
                          D{dayNum}
                        </span>
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            toggleComplete(dayNum);
                          }}
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            border: `2px solid ${isCompleted ? "#34d399" : "rgba(176, 228, 204, 0.3)"}`,
                            background: isCompleted ? "#34d399" : "transparent",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 8,
                            color: isCompleted ? "#000" : "transparent",
                            padding: 0,
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </button>
                      </div>

                      {/* Day topic label */}
                      {entry?.label && (
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 600,
                            color: catColor?.text || "rgba(176, 228, 204, 0.5)",
                            marginBottom: 4,
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {entry.label}
                        </div>
                      )}

                      {/* Problems */}
                      {isReview ? (
                        <div
                          style={{
                            fontSize: 9,
                            color: "rgba(176, 228, 204, 0.4)",
                            fontStyle: "italic",
                          }}
                        >
                          Review day
                        </div>
                      ) : (
                        entry?.problems?.map((p, i) => (
                          <div
                            key={i}
                            style={{
                              fontSize: 9,
                              lineHeight: "1.3",
                              color: isCompleted
                                ? "#6ee7b7"
                                : "rgba(176, 228, 204, 0.65)",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              marginBottom: 1,
                            }}
                          >
                            <span
                              style={{
                                color: completedProblems.has(p.id)
                                  ? "#34d399"
                                  : DIFF_COLOR[p.difficulty]?.color,
                                marginRight: 2,
                              }}
                            >
                              {completedProblems.has(p.id) ? "✓" : "●"}
                            </span>
                            {p.title}
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Category legend */}
            <div style={{ marginTop: 28, minWidth: "min-content" }}>
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "rgba(176, 228, 204, 0.7)",
                  marginBottom: 12,
                }}
              >
                Category Legend
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {Object.entries(CATEGORY_COLORS)
                  .filter(([cat]) => cat !== "DP") // DP is alias of Dynamic Programming
                  .map(([cat, c]) => (
                    <div
                      key={cat}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: c.bg,
                        border: `1px solid ${c.border}40`,
                        borderRadius: 8,
                        padding: "4px 10px",
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: c.border,
                        }}
                      />
                      <span
                        style={{ fontSize: 11, color: c.text, fontWeight: 600 }}
                      >
                        {cat}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div style={{ position: "sticky", top: 20 }}>
            {/* Selected day detail */}
            {selectedDayEntry ? (
              <div
                style={{
                  background: "var(--color-bg-dark)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "rgba(176, 228, 204, 0.5)",
                        marginBottom: 4,
                      }}
                    >
                      Day {selectedDayEntry.day}
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                      {selectedDayEntry.label || `Day ${selectedDayEntry.day}`}
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleComplete(selectedDayEntry.day)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: `1px solid ${completedDays.has(selectedDayEntry.day) ? "#34d399" : "var(--color-border)"}`,
                      background: completedDays.has(selectedDayEntry.day)
                        ? "rgba(52, 211, 153, 0.15)"
                        : "transparent",
                      color: completedDays.has(selectedDayEntry.day)
                        ? "#34d399"
                        : "rgba(176, 228, 204, 0.7)",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {completedDays.has(selectedDayEntry.day)
                      ? "✓ Done"
                      : "Mark Done"}
                  </button>
                </div>

                {selectedDayEntry.problems?.length === 0 ? (
                  <div
                    style={{
                      color: "rgba(176, 228, 204, 0.5)",
                      fontSize: 14,
                      fontStyle: "italic",
                      textAlign: "center",
                      padding: "20px 0",
                    }}
                  >
                    Review &amp; revise previous problems
                  </div>
                ) : (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    {selectedDayEntry.problems.map((p, i) => {
                      const catColor = CATEGORY_COLORS[p.category];
                      const diffColor = DIFF_COLOR[p.difficulty];
                      const problemKey = String(p.id);
                      const hasNote = problemNotes[problemKey];
                      const isProblemDone = completedProblems.has(p.id);
                      return (
                        <div
                          key={i}
                          style={{
                            background: isProblemDone
                              ? "rgba(52, 211, 153, 0.08)"
                              : catColor?.bg || "rgba(176, 228, 204, 0.05)",
                            border: `1px solid ${isProblemDone ? "#34d399" : catColor?.border || "var(--color-border)"}40`,
                            borderRadius: 6,
                            padding: "6px 8px",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {/* Single row: num + title + [note] [done] */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <a
                              href={p.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                fontSize: 9,
                                fontFamily: "monospace",
                                color: "rgba(176, 228, 204, 0.4)",
                                flexShrink: 0,
                                textDecoration: "none",
                                cursor: "pointer",
                                transition: "color 0.2s ease",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.color =
                                  "rgba(176, 228, 204, 0.8)")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.color =
                                  "rgba(176, 228, 204, 0.4)")
                              }
                            >
                              #{p.num}
                            </a>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: isProblemDone
                                  ? "#34d399"
                                  : catColor?.text || "var(--color-accent)",
                                flex: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {p.title}
                            </span>
                            <span
                              style={{
                                fontSize: 8,
                                padding: "1px 5px",
                                borderRadius: 3,
                                background: diffColor?.bg,
                                color: diffColor?.color,
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              {p.difficulty}
                            </span>
                            {/* Note button */}
                            <button
                              onClick={() =>
                                openProblemNoteEditor(
                                  problemKey,
                                  problemNotes[problemKey] || "",
                                )
                              }
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 3,
                                flexShrink: 0,
                                border: `1px solid ${hasNote ? catColor?.border || "var(--color-primary)" : "rgba(176, 228, 204, 0.25)"}`,
                                background: hasNote
                                  ? "rgba(176, 228, 204, 0.12)"
                                  : "transparent",
                                color: hasNote
                                  ? "rgba(176, 228, 204, 0.9)"
                                  : "rgba(176, 228, 204, 0.4)",
                                cursor: "pointer",
                                fontSize: 10,
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              title={hasNote ? "Edit note" : "Add note"}
                            >
                              📝
                            </button>
                            {/* Mark done checkbox */}
                            <button
                              onClick={() => toggleProblemComplete(p.id)}
                              title={
                                isProblemDone ? "Mark undone" : "Mark done"
                              }
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: 3,
                                flexShrink: 0,
                                padding: 0,
                                border: `1.5px solid ${isProblemDone ? "#34d399" : "rgba(176, 228, 204, 0.35)"}`,
                                background: isProblemDone
                                  ? "#34d399"
                                  : "transparent",
                                color: "#000",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                                fontWeight: 900,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#34d399";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor =
                                  isProblemDone
                                    ? "#34d399"
                                    : "rgba(176, 228, 204, 0.35)";
                              }}
                            >
                              {isProblemDone ? "✓" : ""}
                            </button>
                          </div>

                          {/* Notes preview */}
                          {hasNote && (
                            <div
                              style={{
                                fontSize: 9,
                                color: "rgba(176, 228, 204, 0.5)",
                                fontStyle: "italic",
                                marginTop: 3,
                                paddingTop: 3,
                                borderTop:
                                  "1px solid rgba(176, 228, 204, 0.08)",
                                lineHeight: "1.3",
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                textOverflow: "ellipsis",
                              }}
                            >
                              📌 {problemNotes[problemKey]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  background: "var(--color-bg-dark)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
                <div
                  style={{ color: "rgba(176, 228, 204, 0.5)", fontSize: 14 }}
                >
                  Click a day to see problems
                </div>
              </div>
            )}
            {/* Day Notes Section */}
            {selectedDayEntry && (
              <div
                style={{
                  background: "var(--color-bg-dark)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
                    📌 Day Notes
                  </h3>
                  <button
                    onClick={() => openDayNoteEditor(selectedDayEntry.day)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      border: "1px solid rgba(176, 228, 204, 0.3)",
                      background: "transparent",
                      color: "rgba(176, 228, 204, 0.7)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(176, 228, 204, 0.7)";
                      e.currentTarget.style.background =
                        "rgba(176, 228, 204, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(176, 228, 204, 0.3)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {dayNotes[getDayNoteKey(selectedDayEntry.day)]
                      ? "✏ Edit"
                      : "✏ Add"}
                  </button>
                </div>
                {(() => {
                  const dayKey = getDayNoteKey(selectedDayEntry.day);
                  const hasNote = dayNotes[dayKey];
                  return hasNote ? (
                    <div
                      style={{
                        fontSize: 12,
                        color: "rgba(176, 228, 204, 0.8)",
                        lineHeight: "1.5",
                        padding: "12px",
                        background: "rgba(176, 228, 204, 0.05)",
                        borderRadius: 8,
                        borderLeft: "3px solid var(--color-primary)",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {dayNotes[dayKey]}
                    </div>
                  ) : (
                    <div
                      style={{
                        color: "rgba(176, 228, 204, 0.4)",
                        fontSize: 12,
                        fontStyle: "italic",
                        textAlign: "center",
                        padding: "16px 0",
                      }}
                    >
                      No notes added yet
                    </div>
                  );
                })()}
              </div>
            )}
            {/* All days list */}
            <div
              style={{
                background: "var(--color-bg-dark)",
                border: "1px solid var(--color-border)",
                borderRadius: 16,
                padding: 20,
                maxHeight: 480,
                overflowY: "auto",
              }}
            >
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 16,
                  marginTop: 0,
                }}
              >
                All {totalDays} Days
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {resolvedDays.map((entry) => {
                  const isCompleted = completedDays.has(entry.day);
                  const cat = dayPrimaryCategory(entry);
                  const catColor = cat ? CATEGORY_COLORS[cat] : null;
                  return (
                    <div
                      key={entry.day}
                      onClick={() =>
                        setSelectedDay(
                          selectedDay === entry.day ? null : entry.day,
                        )
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "6px 10px",
                        borderRadius: 8,
                        cursor: "pointer",
                        background:
                          selectedDay === entry.day
                            ? catColor?.bg || "rgba(176, 228, 204, 0.08)"
                            : "transparent",
                        transition: "background 0.15s ease",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 11,
                          color: "rgba(176, 228, 204, 0.4)",
                          minWidth: 28,
                        }}
                      >
                        D{entry.day}
                      </span>
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          flexShrink: 0,
                          background:
                            catColor?.border || "rgba(176, 228, 204, 0.2)",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          flex: 1,
                          color: isCompleted
                            ? "#34d399"
                            : "rgba(176, 228, 204, 0.8)",
                          textDecoration: isCompleted ? "line-through" : "none",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {entry.label ||
                          entry.problems?.[0]?.title ||
                          `Day ${entry.day}`}
                      </span>
                      {entry.problems?.length > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            color: "rgba(176, 228, 204, 0.35)",
                          }}
                        >
                          {entry.problems.length}p
                        </span>
                      )}
                      {isCompleted && (
                        <span style={{ fontSize: 10, color: "#34d399" }}>
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Problem Note Modal ── */}
      {editingNoteId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--color-bg-dark)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid var(--color-border)",
              maxWidth: 500,
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginTop: 0,
                marginBottom: 16,
              }}
            >
              📝 Problem Notes
            </h2>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your notes, approach, hints, or reflections here..."
              style={{
                width: "100%",
                minHeight: 200,
                padding: "12px",
                borderRadius: 8,
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-darker)",
                color: "var(--color-accent)",
                fontSize: 13,
                fontFamily: "monospace",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 16,
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setEditingNoteId(null);
                  setNoteText("");
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                  color: "rgba(176, 228, 204, 0.7)",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveProblemNote}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  background: "var(--color-primary)",
                  color: "#000",
                  cursor: "pointer",
                }}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Day Note Modal ── */}
      {editingDayNote && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--color-bg-dark)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid var(--color-border)",
              maxWidth: 500,
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginTop: 0,
                marginBottom: 16,
              }}
            >
              📌 Day {selectedDay} Notes ({totalDays}-day calendar)
            </h2>
            <textarea
              value={dayNoteText}
              onChange={(e) => setDayNoteText(e.target.value)}
              placeholder="Add daily recap, key learnings, or progress notes..."
              style={{
                width: "100%",
                minHeight: 200,
                padding: "12px",
                borderRadius: 8,
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-darker)",
                color: "var(--color-accent)",
                fontSize: 13,
                fontFamily: "monospace",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 16,
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setEditingDayNote(false);
                  setDayNoteText("");
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                  color: "rgba(176, 228, 204, 0.7)",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveDayNote}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  background: "var(--color-primary)",
                  color: "#000",
                  cursor: "pointer",
                }}
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
