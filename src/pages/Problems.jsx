import { useEffect, useState } from 'react';
import { fetchProblems } from '../services/api';
import { Link } from 'react-router-dom';
import CalendarHeatmap from 'react-calendar-heatmap';
import { subDays } from 'date-fns';
import 'react-calendar-heatmap/dist/styles.css';
import '../index.css';

const TAGS = ['Array', 'String', 'Dynamic Programming', 'Tree', 'Greedy', 'Graph', 'Math', 'Hashing'];

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    const getProblems = async () => {
      try {
        const res = await fetchProblems();
        setProblems(res.data);
      } catch (err) {
        console.error("Failed to fetch problems", err);
      }
    };
    getProblems();
  }, []);

  const streakData = [
    { date: '2025-07-01', count: 1 },
    { date: '2025-07-02', count: 2 },
    { date: '2025-07-03', count: 3 },
    { date: '2025-07-04', count: 1 },
    { date: '2025-07-06', count: 2 },
    { date: '2025-07-08', count: 3 },
  ];

  const getColorClass = (value) => {
    if (!value) return 'color-empty';
    if (value.count >= 4) return 'color-github-4';
    if (value.count === 3) return 'color-github-3';
    if (value.count === 2) return 'color-github-2';
    if (value.count === 1) return 'color-github-1';
    return 'color-empty';
  };

  const filtered = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? p.tags?.includes(selectedTag) : true;
    const matchesDifficulty = difficulty ? p.difficulty === difficulty : true;
    return matchesSearch && matchesTag && matchesDifficulty;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      {/* Header & Heatmap */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-indigo-800">📚 All Problems</h2>
        <div className="border p-3 bg-gray-50 rounded shadow-sm">
          <h3 className="text-sm text-center font-semibold mb-1">🔥 Practice Streak</h3>
          <CalendarHeatmap
            startDate={subDays(new Date(), 100)}
            endDate={new Date()}
            values={streakData}
            classForValue={getColorClass}
            showWeekdayLabels={false}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
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

      {/* Horizontal Tags Scroll */}
      <div className="flex overflow-x-auto gap-2 mb-6 scrollbar-hide">
        {TAGS.map((tag) => (
          <button
            key={tag}
            className={`px-4 py-1 border rounded-full whitespace-nowrap transition text-sm font-medium ${
              selectedTag === tag
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Problems Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Difficulty</th>
              <th className="py-2 px-4">Tags</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((problem) => (
              <tr
                key={problem.id?.$oid || problem.id}
                className="hover:bg-gray-50 transition"
              >
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
                  {problem.tags?.map((tag, idx) => (
                    <span key={idx} className="inline-block mr-2 bg-gray-100 px-2 py-1 rounded-full text-xs">
                      #{tag}
                    </span>
                  )) || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No matching problems found.</p>
        )}
      </div>
    </div>
  );
}