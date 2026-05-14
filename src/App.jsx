import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import MyClasses from './pages/MyClasses'
import Attendance from './pages/Attendance'
import Timetable from './pages/Timetable'
import Subjects from './pages/Subjects'
import Homework from './pages/Homework'
import Tests from './pages/Tests'
import Notices from './pages/Notices'
import Events from './pages/Events'
import Planner from './pages/Planner'
import Performance from './pages/Performance'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="classes" element={<MyClasses />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="homework" element={<Homework />} />
        <Route path="tests" element={<Tests />} />
        <Route path="notices" element={<Notices />} />
        <Route path="events" element={<Events />} />
        <Route path="planner" element={<Planner />} />
        <Route path="performance" element={<Performance />} />
      </Route>
    </Routes>
  )
}

export default App
