// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        CodeJudge
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/problems" className="hover:underline">
          Problems
        </Link>

        {user ? (
          <>
            <span className="text-sm">Welcome, {user.username}</span>
            <button
              onClick={logoutUser}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
