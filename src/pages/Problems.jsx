import { useEffect, useState } from 'react';
import { fetchProblems, fetchSubmissions } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TAGS = ['Array', 'String', 'Dynamic Programming', 'Tree', 'Greedy', 'Graph', 'Math', 'Hashing'];
const COMPANIES = ['Amazon', 'Google', 'Microsoft', 'Adobe', 'Flipkart', 'Uber', 'Samsung'];

export default function Problems() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [probsRes, subsRes] = await Promise.all([
          fetchProblems(),
          fetchSubmissions()
        ]);
        setProblems(probsRes.data);
        const userSolved = subsRes.data
          .filter(sub => sub.username === user?.username && sub.status === 'Success')
          .map(sub => sub.problemTitle);
        setSubmissions(userSolved);
      } catch (err) {
        console.error("Error loading problems or submissions", err);
      }
    };
    loadData();
  }, [user]);

  const filtered = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? p.tags?.includes(selectedTag) : true;
    const matchesCompany = selectedCompany ? p.tags?.includes(selectedCompany) : true;
    const matchesDifficulty = difficulty ? p.difficulty === difficulty : true;
    return matchesSearch && matchesTag && matchesCompany && matchesDifficulty;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6">📚 All Problems</h2>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search by title"
          className="border p-2 rounded w-full md:w-1/3"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">🟢 Easy</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Hard">🔴 Hard</option>
        </select>
      </div>

      {/* Tag Filter */}
      <div className="flex overflow-x-auto gap-2 mb-4 scrollbar-hide">
        {TAGS.map((tag) => (
          <button
            key={tag}
            className={`px-4 py-1 border rounded-full whitespace-nowrap transition text-sm font-medium ${
              selectedTag === tag
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => {
              setSelectedTag(tag === selectedTag ? '' : tag);
              setSelectedCompany('');
            }}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Company Tags */}
      <div className="flex overflow-x-auto gap-2 mb-6 scrollbar-hide">
        {COMPANIES.map((company) => (
          <button
            key={company}
            className={`px-4 py-1 border rounded-full whitespace-nowrap transition text-sm font-medium ${
              selectedCompany === company
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => {
              setSelectedCompany(company === selectedCompany ? '' : company);
              setSelectedTag('');
            }}
          >
            #{company}
          </button>
        ))}
      </div>

      {/* Problems Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Difficulty</th>
              <th className="py-2 px-4">Tags</th>
            </tr>
          </thead>
          <tbody>
  {filtered.map((problem, idx) => {
    const isSolved = submissions.includes(problem.title);
    return (
      <tr
        key={problem._id?.$oid || problem.id}
        className={`transition ${isSolved ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'}`}
      >
        <td className="py-2 px-4">{idx + 1}</td>
        <td className="py-2 px-4 text-blue-600 hover:underline">
          <Link to={`/problems/${problem._id?.$oid || problem.id}`}>
            {problem.title}
          </Link>
        </td>
        <td className="py-2 px-4 font-semibold">
          <span className={
            problem.difficulty === 'Easy'
              ? 'text-green-600'
              : problem.difficulty === 'Medium'
              ? 'text-yellow-600'
              : 'text-red-600'
          }>
            {problem.difficulty}
          </span>
        </td>
        <td className="py-2 px-4 text-sm text-gray-600">
          {problem.tags?.map((tag, i) => (
            <span key={i} className="inline-block mr-2 bg-gray-100 px-2 py-1 rounded-full text-xs">
              #{tag}
            </span>
          )) || '—'}
        </td>
      </tr>
    );
  })}
</tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No matching problems found.</p>
        )}
      </div>
    </div>
  );
}