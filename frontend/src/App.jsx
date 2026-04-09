import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Book } from './pages/Book';
import { Ticket } from './pages/Ticket';
import { Account } from './pages/Account';
import { PNR } from './pages/PNR';
import { RouteMap } from './pages/RouteMap';
import { useAuthStore } from './store/authStore';

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
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
