const d = (offsetDays = 0) => {
  const dt = new Date()
  dt.setDate(dt.getDate() + offsetDays)
  return dt.toISOString().split('T')[0]
}

export const initialClasses = [
  { id: 'c1', grade: 'Grade 10', section: 'A', subject: 'Advanced Mathematics', teacherName: 'Dr. Sarah Weaver' },
  { id: 'c2', grade: 'Grade 11', section: 'B', subject: 'Quantum Physics', teacherName: 'Dr. Sarah Weaver' },
  { id: 'c3', grade: 'Grade 12', section: 'C', subject: 'Modern Literature', teacherName: 'Dr. Sarah Weaver' },
]

export const initialStudents = [
  { id: 's1', name: 'Amara Okafor',  classId: 'c1', rollNo: '001', initials: 'AO', color: 'bg-purple-300' },
  { id: 's2', name: 'Julian Archer',  classId: 'c1', rollNo: '002', initials: 'JA', color: 'bg-indigo-300' },
  { id: 's3', name: 'Liam Sterling',  classId: 'c1', rollNo: '003', initials: 'LS', color: 'bg-blue-300' },
  { id: 's4', name: 'Elena Petrov',   classId: 'c1', rollNo: '004', initials: 'EP', color: 'bg-red-200' },
  { id: 's5', name: 'Marcus Thorne',  classId: 'c2', rollNo: '001', initials: 'MT', color: 'bg-emerald-300' },
  { id: 's6', name: 'Aria Sterling',  classId: 'c2', rollNo: '002', initials: 'AS', color: 'bg-pink-300' },
  { id: 's7', name: 'Oliver Kent',    classId: 'c2', rollNo: '003', initials: 'OK', color: 'bg-amber-300' },
  { id: 's8', name: 'Sofia Reyes',    classId: 'c3', rollNo: '001', initials: 'SR', color: 'bg-teal-300' },
]

export const initialAttendance = [
  { id: 'a1', studentId: 's1', classId: 'c1', date: d(-1), status: 'present' },
  { id: 'a2', studentId: 's2', classId: 'c1', date: d(-1), status: 'present' },
  { id: 'a3', studentId: 's3', classId: 'c1', date: d(-1), status: 'absent' },
  { id: 'a4', studentId: 's4', classId: 'c1', date: d(-1), status: 'present' },
  { id: 'a5', studentId: 's5', classId: 'c2', date: d(-1), status: 'present' },
  { id: 'a6', studentId: 's6', classId: 'c2', date: d(-1), status: 'present' },
  { id: 'a7', studentId: 's7', classId: 'c2', date: d(-1), status: 'absent' },
  { id: 'a8', studentId: 's8', classId: 'c3', date: d(-1), status: 'present' },
]

export const initialHomework = [
  { id: 'hw1', title: 'Linear Algebra Problems', subject: 'Advanced Mathematics', classId: 'c1', dueDate: d(1), description: 'Complete exercises 5.1–5.4 from textbook.', status: 'active', createdAt: d(-1) },
  { id: 'hw2', title: 'Wave-Particle Duality Essay', subject: 'Quantum Physics', classId: 'c2', dueDate: d(2), description: 'Write a 500-word essay on wave-particle duality.', status: 'active', createdAt: d(-1) },
  { id: 'hw3', title: 'Renaissance Literature Analysis', subject: 'Modern Literature', classId: 'c3', dueDate: d(-2), description: 'Analyze the works of Shakespeare in context.', status: 'archived', createdAt: d(-4) },
  { id: 'hw4', title: 'Calculus Worksheet', subject: 'Advanced Mathematics', classId: 'c1', dueDate: d(3), description: 'Differentiation and integration practice problems.', status: 'active', createdAt: d(0) },
  { id: 'hw5', title: 'Quantum Mechanics Quiz Prep', subject: 'Quantum Physics', classId: 'c2', dueDate: d(5), description: 'Prepare for upcoming quiz on Schrödinger equation.', status: 'active', createdAt: d(0) },
]

export const initialTests = [
  { id: 't1', name: 'Unit Test 2',         subject: 'Advanced Mathematics', classId: 'c1', date: d(-3), maxMarks: 100 },
  { id: 't2', name: 'Mid-term Assessment', subject: 'Quantum Physics',      classId: 'c2', date: d(-5), maxMarks: 100 },
]

export const initialMarks = [
  { id: 'm1', testId: 't1', studentId: 's1', marks: 92, absent: false },
  { id: 'm2', testId: 't1', studentId: 's2', marks: 88, absent: false },
  { id: 'm3', testId: 't1', studentId: 's3', marks: 76, absent: false },
  { id: 'm4', testId: 't1', studentId: 's4', marks: 64, absent: false },
  { id: 'm5', testId: 't2', studentId: 's5', marks: 75, absent: false },
  { id: 'm6', testId: 't2', studentId: 's6', marks: 88, absent: false },
  { id: 'm7', testId: 't2', studentId: 's7', marks: 94, absent: false },
]

export const initialNotices = [
  { id: 'n1', title: 'Quarterly Science Fair Registration', description: 'Registration for the annual science fair is now open.', audience: 'Grade 10-A, 10-B', badge: 'Academics', createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'n2', title: 'Annual Sports Day Volunteer List',     description: 'Sign up to volunteer for the upcoming sports day event.',  audience: 'Faculty & Staff',     badge: 'Events',    createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: 'n3', title: 'Campus Maintenance: East Wing Access', description: 'East wing inaccessible Mon–Wed for maintenance.',         audience: 'All Students',        badge: 'Critical',  createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString() },
]

export const initialEvents = [
  { id: 'ev1', title: 'Inter-School Debate Finals',   date: d(2),  time: '10:00', audience: 'Grade 11 & 12', description: 'Final round of inter-school debate competition.', badge: 'Academic' },
  { id: 'ev2', title: 'Quarterly Review Meeting',     date: d(6),  time: '16:30', audience: 'Staff Lounge',   description: 'Quarterly academic review meeting for all faculty.', badge: 'Faculty' },
  { id: 'ev3', title: 'Robotics Kit Orientation',     date: d(10), time: '09:15', audience: 'Grade 9 - C',   description: 'Introduction to the new robotics curriculum.', badge: 'Workshop' },
]

export const initialLessons = [
  { id: 'l1', date: d(1), classId: 'c1', subject: 'Advanced Mathematics', title: 'Quantum Mechanics Introduction', description: "Exploring Schrödinger's equation.", period: 'Period 3' },
  { id: 'l2', date: d(2), classId: 'c2', subject: 'Quantum Physics',      title: 'Complex Derivatives',           description: 'Advanced chain rule applications.', period: 'Period 1' },
  { id: 'l3', date: d(6), classId: 'c3', subject: 'Modern Literature',    title: 'The Renaissance Shift',         description: 'Cultural paradigm shift in 14th century Europe.', period: 'Period 4' },
  { id: 'l4', date: d(8), classId: 'c1', subject: 'Advanced Mathematics', title: 'Molecular Dynamics Lab',        description: 'Practical examination of thermal conductivity.', period: 'Period 2' },
]

export const initialSubjects = [
  { id: 'sub1', name: 'Advanced Mathematics', classId: 'c1', topicsTotal: 24, topicsDone: 18, color: 'bg-indigo-100 text-indigo-800' },
  { id: 'sub2', name: 'Quantum Physics',       classId: 'c2', topicsTotal: 20, topicsDone: 12, color: 'bg-emerald-100 text-emerald-800' },
  { id: 'sub3', name: 'Modern Literature',     classId: 'c3', topicsTotal: 16, topicsDone: 10, color: 'bg-amber-100 text-amber-800' },
  { id: 'sub4', name: 'Chemistry',             classId: 'c1', topicsTotal: 22, topicsDone: 8,  color: 'bg-rose-100 text-rose-800' },
  { id: 'sub5', name: 'Biology',               classId: 'c2', topicsTotal: 18, topicsDone: 14, color: 'bg-teal-100 text-teal-800' },
]
