import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { VerifyEmailPage } from './pages/VerifyEmailPage'
import { DashboardPage } from './pages/DashboardPage'
import { AduunuudPage } from './pages/AduunuudPage'
import { AduuDetailPage } from './pages/AduuDetailPage'
import { UulderPage } from './pages/UulderPage'
import { AmjiltPage } from './pages/AmjiltPage'
import { BulegPage } from './pages/BulegPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { MainLayout } from './components/MainLayout'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected routes with layout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/aduu" element={<AduunuudPage />} />
          <Route path="/aduu/:id" element={<AduuDetailPage />} />
          <Route path="/uulder" element={<UulderPage />} />
          <Route path="/buleg" element={<BulegPage />} />
          <Route path="/amjilt" element={<AmjiltPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
