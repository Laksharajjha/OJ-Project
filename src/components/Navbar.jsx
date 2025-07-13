import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="bg-gray-900 text-white shadow-md px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-2xl font-bold text-indigo-400 tracking-tight">
          CodeJudge
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-sm font-medium">
          <NavLink
            to="/problems"
            className={({ isActive }) =>
              isActive ? "text-indigo-300 underline" : "hover:text-indigo-200"
            }
          >
            Problems
          </NavLink>
          <NavLink
            to="/create-problem"
            className={({ isActive }) =>
              isActive ? "text-indigo-300 underline" : "hover:text-indigo-200"
            }
          >
            Create
          </NavLink>
          <NavLink
            to="/submissions"
            className={({ isActive }) =>
              isActive ? "text-indigo-300 underline" : "hover:text-indigo-200"
            }
          >
            Submissions
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "text-indigo-300 underline" : "hover:text-indigo-200"
            }
          >
            Dashboard
          </NavLink>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4 text-sm">
          {user ? (
            <>
              <span className="text-gray-300">👋 {user.username}</span>
              <button
                onClick={logoutUser}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "text-indigo-300 underline" : "hover:text-indigo-200"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "text-indigo-300 underline" : "hover:text-indigo-200"
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}