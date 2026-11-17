
import { Routes, Route, Navigate } from 'react-router-dom'

import AppLayout from './components/AppLayout'

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

      {/* Authentication Pages */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main Application Pages */}
      <Route
        path="/dashboard"
        element={
          <AppLayout>
            <Dashboard />
          </AppLayout>
        }
      />

      <Route
        path="/projects"
        element={
          <AppLayout>
            <Projects />
          </AppLayout>
        }
      />

      <Route
        path="/students"
        element={
          <AppLayout>
            <Students />
          </AppLayout>
        }
      />

      <Route
        path="/hackathons"
        element={
          <AppLayout>
            <Hackathons />
          </AppLayout>
        }
      />

      <Route
        path="/teams"
        element={
          <AppLayout>
            <Teams />
          </AppLayout>
        }
      />

      {/* Unknown Routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  )
}

export default App
