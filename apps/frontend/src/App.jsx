import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Historico from './pages/Historico';
import SidebarLayout from './components/SidebarLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? (
          <SidebarLayout onLogout={handleLogout}>
            <Dashboard />
          </SidebarLayout>
        ) : <Navigate to="/login" />}
      />
      <Route
        path="/historico"
        element={isAuthenticated ? (
          <SidebarLayout onLogout={handleLogout}>
            <Historico />
          </SidebarLayout>
        ) : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;
