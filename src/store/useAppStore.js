import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  initialClasses, initialStudents, initialAttendance,
  initialHomework, initialTests, initialMarks,
  initialNotices, initialEvents, initialLessons, initialSubjects,
} from './seedData'

let _id = Date.now()
const uid = () => `${++_id}`

export const useAppStore = create(
  persist(
    (set, get) => ({
      // ─── STATE ──────────────────────────────────────────────
      classes:    initialClasses,
      students:   initialStudents,
      attendance: initialAttendance,
      homework:   initialHomework,
      tests:      initialTests,
      marks:      initialMarks,
      notices:    initialNotices,
      events:     initialEvents,
      lessons:    initialLessons,
      subjects:   initialSubjects,

      // ─── CLASSES ────────────────────────────────────────────
      addClass:    (cls)     => set(s => ({ classes: [...s.classes,    { ...cls,  id: uid() }] })),
      updateClass: (id, cls) => set(s => ({ classes: s.classes.map(c => c.id === id ? { ...c, ...cls }  : c) })),
      deleteClass: (id)      => set(s => ({ classes: s.classes.filter(c => c.id !== id) })),

      // ─── STUDENTS ───────────────────────────────────────────
      addStudent:    (st)     => set(s => ({ students: [...s.students,   { ...st,   id: uid() }] })),
      updateStudent: (id, st) => set(s => ({ students: s.students.map(x => x.id === id ? { ...x, ...st } : x) })),
      deleteStudent: (id)     => set(s => ({ students: s.students.filter(x => x.id !== id) })),

      // ─── ATTENDANCE ─────────────────────────────────────────
      markAttendance: ({ studentId, classId, date, status }) =>
        set(s => {
          const idx = s.attendance.findIndex(a =>
            a.studentId === studentId && a.classId === classId && a.date === date
          )
          if (idx >= 0) {
            const arr = [...s.attendance]
            arr[idx] = { ...arr[idx], status }
            return { attendance: arr }
          }
          return { attendance: [...s.attendance, { id: uid(), studentId, classId, date, status }] }
        }),

      // ─── HOMEWORK ───────────────────────────────────────────
      addHomework:    (hw)      => set(s => ({ homework: [{ ...hw, id: uid(), createdAt: new Date().toISOString().split('T')[0], status: hw.status || 'active' }, ...s.homework] })),
      updateHomework: (id, hw)  => set(s => ({ homework: s.homework.map(h => h.id === id ? { ...h, ...hw } : h) })),
      deleteHomework: (id)      => set(s => ({ homework: s.homework.filter(h => h.id !== id) })),

      // ─── TESTS ──────────────────────────────────────────────
      addTest:    (test) => set(s => ({ tests: [{ ...test, id: uid() }, ...s.tests] })),
      deleteTest: (id)   => set(s => ({ tests: s.tests.filter(t => t.id !== id) })),

      // ─── MARKS ──────────────────────────────────────────────
      saveMarks: (testId, marksArr) =>
        set(s => ({
          marks: [
            ...s.marks.filter(m => m.testId !== testId),
            ...marksArr.map(m => ({ ...m, id: uid(), testId })),
          ],
        })),
      updateMark: (testId, studentId, data) =>
        set(s => ({
          marks: s.marks.map(m =>
            m.testId === testId && m.studentId === studentId ? { ...m, ...data } : m
          ),
        })),

      // ─── NOTICES ────────────────────────────────────────────
      addNotice:    (n)   => set(s => ({ notices: [{ ...n, id: uid(), createdAt: new Date().toISOString() }, ...s.notices] })),
      deleteNotice: (id)  => set(s => ({ notices: s.notices.filter(n => n.id !== id) })),

      // ─── EVENTS ─────────────────────────────────────────────
      addEvent:    (ev)  => set(s => ({ events: [...s.events, { ...ev, id: uid() }].sort((a, b) => a.date.localeCompare(b.date)) })),
      deleteEvent: (id)  => set(s => ({ events: s.events.filter(e => e.id !== id) })),

      // ─── LESSONS ────────────────────────────────────────────
      addLesson:    (l)   => set(s => ({ lessons: [...s.lessons, { ...l, id: uid() }].sort((a, b) => a.date.localeCompare(b.date)) })),
      deleteLesson: (id)  => set(s => ({ lessons: s.lessons.filter(l => l.id !== id) })),

      // ─── SUBJECTS ───────────────────────────────────────────
      addSubject:             (sub) => set(s => ({ subjects: [...s.subjects, { ...sub, id: uid(), topicsDone: 0 }] })),
      updateSubjectProgress:  (id, topicsDone) => set(s => ({ subjects: s.subjects.map(sub => sub.id === id ? { ...sub, topicsDone } : sub) })),
      deleteSubject:          (id) => set(s => ({ subjects: s.subjects.filter(sub => sub.id !== id) })),

      // ─── COMPUTED HELPERS ────────────────────────────────────
      getTodayAttendanceRate: () => {
        const { attendance, students } = get()
        const today = new Date().toISOString().split('T')[0]
        const todayRecs = attendance.filter(a => a.date === today)
        if (!students.length) return 0
        const present = todayRecs.filter(a => a.status === 'present').length
        return Math.round((present / students.length) * 100)
      },
      getPendingHomeworkCount: () => get().homework.filter(h => h.status === 'active').length,
      getUpcomingTestsCount:   () => {
        const today = new Date().toISOString().split('T')[0]
        return get().tests.filter(t => t.date >= today).length
      },
      getTodaysLessons: () => {
        const today = new Date().toISOString().split('T')[0]
        return get().lessons.filter(l => l.date === today)
      },
      getStudentAvgMarks: (studentId) => {
        const studentMarks = get().marks.filter(m => m.studentId === studentId && !m.absent)
        if (!studentMarks.length) return 0
        return Math.round(studentMarks.reduce((sum, m) => sum + m.marks, 0) / studentMarks.length)
      },
      getStudentAttendanceRate: (studentId) => {
        const recs = get().attendance.filter(a => a.studentId === studentId)
        if (!recs.length) return 0
        const present = recs.filter(a => a.status === 'present').length
        return Math.round((present / recs.length) * 100)
      },
    }),
    { name: 'lumina-store' }
  )
)
