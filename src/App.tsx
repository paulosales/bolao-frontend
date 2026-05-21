import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Layout from './components/layout/Layout'
import PrivateRoute from './components/layout/PrivateRoute'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import CreatePoolPage from './pages/Pool/CreatePoolPage'
import PoolDetailPage from './pages/Pool/PoolDetailPage'
import PoolSettingsPage from './pages/Pool/PoolSettingsPage'
import PoolRulesPage from './pages/Pool/PoolRulesPage'
import AcceptInvitePage from './pages/Invite/AcceptInvitePage'
import { useAppDispatch, useAppSelector } from './hooks/useRedux'
import { fetchMe } from './store/authSlice'

function AppInit() {
  const dispatch = useAppDispatch()
  const token = useAppSelector((s) => s.auth.token)

  useEffect(() => {
    if (token) dispatch(fetchMe())
  }, [dispatch, token])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInit />
      <Routes>
        {/* Public routes without layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/convite/:token" element={<AcceptInvitePage />} />

        {/* Routes with shared layout */}
        <Route element={<Layout />}>
          {/* Public redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/pools/create" element={<CreatePoolPage />} />
            <Route path="/pools/:id" element={<PoolDetailPage />} />
            <Route path="/pools/:id/settings" element={<PoolSettingsPage />} />
            <Route path="/pools/:id/rules" element={<PoolRulesPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  )
}
