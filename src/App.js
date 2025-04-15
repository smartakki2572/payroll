import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';
import EmployeeList from './EmployeeList';
import EmployeeDetail from './EmployeeDetail';
import AttendanceManagement from './AttendanceManagement';
import SalaryManagement from './SalaryManagement';
import AdvanceManagement from './AdvanceManagement';
import Reports from './Reports';
import Settings from './Settings';
import NotFound from './NotFound';
import Layout from './Layout';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const { isAuthenticated, checkAuth, loading } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
      
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/attendance" element={<AttendanceManagement />} />
          <Route path="/payroll" element={<SalaryManagement />} />
          <Route path="/advances" element={<AdvanceManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;