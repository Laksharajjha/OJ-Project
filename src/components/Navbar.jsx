import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">CodeJudge</Link>
        <div className="space-x-4">
          <Link to="/problems" className="text-gray-600 hover:text-black">Problems</Link>
          <Link to="/create-problem" className="text-gray-600 hover:text-black">Add Problem</Link>
          <Link to="/login" className="text-gray-600 hover:text-black">Login</Link>
          <Link to="/register" className="text-gray-600 hover:text-black">Register</Link>
          <Link to="/submissions" className="text-white hover:underline px-2">Submissions</Link>

        </div>
      </div>
    </nav>
  );
}
