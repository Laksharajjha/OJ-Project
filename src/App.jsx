import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import PageWrapper from './components/PageWrapper';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateProblem from './pages/CreateProblem';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import Submissions from './pages/Submissions';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function AnimatedRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      {loading && <Loader />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />

          {/* Private Routes */}
          <Route
            path="/create-problem"
            element={
              <PrivateRoute>
                <PageWrapper><CreateProblem /></PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/problems"
            element={
              <PrivateRoute>
                <PageWrapper><Problems /></PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/problems/:id"
            element={
              <PrivateRoute>
                <PageWrapper><ProblemDetail /></PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/submissions"
            element={
              <PrivateRoute>
                <PageWrapper><Submissions /></PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <PageWrapper><Dashboard /></PageWrapper>
              </PrivateRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="p-4">
          <AnimatedRoutes />
        </main>
      </Router>
    </AuthProvider>
  );
}