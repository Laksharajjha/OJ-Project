// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link to="/" className="font-bold text-xl">
          CodeJudge
        </Link>
        <Link to="/problems" className="hover:underline">
          Problems
        </Link>
        <Link to="/create-problem" className="hover:underline">
          Create
        </Link>
        <Link to="/submissions" className="hover:underline">
          Submissions
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-sm">Welcome, <strong>{user.username}</strong></span>
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
