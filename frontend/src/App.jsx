import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Book } from './pages/Book';
import { Ticket } from './pages/Ticket';
import { Account } from './pages/Account';
import { PNR } from './pages/PNR';
import { RouteMap } from './pages/RouteMap';
import { useAuthStore } from './store/authStore';
import { authAPI } from './services/api';

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { isAuthenticated, user, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      authAPI.getMe()
        .then(res => {
          if (res.data.success) {
            setUser(res.data.user || res.data.data);
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, [isAuthenticated, user, setUser, logout]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/book/:id" element={<ProtectedRoute><Book /></ProtectedRoute>} />
        <Route path="/ticket/:ticketId" element={<ProtectedRoute><Ticket /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/pnr" element={<PNR />} />
        <Route path="/route/:id" element={<RouteMap />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
