
import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Hackathons from './pages/Hackathons'
import Students from './pages/Students'
import Teams from './pages/Teams'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/hackathons" element={<Hackathons />} />
      <Route path="/students" element={<Students />} />
      <Route path="/teams" element={<Teams />} />
    </Routes>
  )
}

export default App
