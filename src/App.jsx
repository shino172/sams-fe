import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CooperativeSetupPage from './pages/CooperativeSetupPage';
import DashboardApi from './components/DashboardApi';
import CropSeasonsApi from './components/CropSeasonsApi';
import FarmingLogApi from './components/FarmingLogApi';
import FarmersPage from './pages/FarmersPage';
import FieldsPage from './pages/FieldsPage';
import SchedulePage from './pages/SchedulePage';
import ReportsPage from './pages/ReportsPage';

function AuthenticatedApp() {
  const { user } = useAuth();
  const isFarmer = user?.role === 'farmer';

  if (isFarmer) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/my-crops" replace />} />
        <Route element={<AppLayout title="SAMS — Nông dân" />}>
          <Route path="/dashboard" element={<DashboardApi />} />
          <Route path="/my-crops" element={<CropSeasonsApi />} />
          <Route path="/logs" element={<FarmingLogApi />} />
          <Route path="/schedule" element={<SchedulePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/my-crops" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<AppLayout title="SAMS — Hợp tác xã" />}>
        <Route path="/dashboard" element={<DashboardApi />} />
        <Route path="/farmers" element={<FarmersPage />} />
        <Route path="/fields" element={<FieldsPage />} />
        <Route path="/crop-seasons" element={<CropSeasonsApi />} />
        <Route path="/logs" element={<FarmingLogApi />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
      <Route path="/my-crops" element={<Navigate to="/crop-seasons" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/cooperative/setup"
            element={
              <ProtectedRoute roles={['cooperative_admin']}>
                <CooperativeSetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AuthenticatedApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
