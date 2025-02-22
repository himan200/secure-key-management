import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from './components/LandingPage'
import { LoginPage } from './components/LoginPage'
import { RegisterPage } from './components/RegisterPage'
// import { Dashboard } from './components/Dashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  // Add authentication handlers
  const handleLogin = (email) => {
    setIsAuthenticated(true)
    setUserEmail(email)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserEmail('')
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={<LoginPage onLogin={handleLogin} />} 
        />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route 
          path="/dashboard" 
          element={
            <Dashboard 
              isAuthenticated={isAuthenticated} 
              userEmail={userEmail}
              onLogout={handleLogout}
            />
          } 
        /> */}
      </Routes>
    </Router>
  )
}

export default App