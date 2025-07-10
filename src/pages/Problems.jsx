import { useEffect, useState } from 'react';
import { fetchProblems } from '../services/api';
import { Link } from 'react-router-dom';
import CalendarHeatmap from 'react-calendar-heatmap';
import { subDays } from 'date-fns';
import 'react-calendar-heatmap/dist/styles.css';
import '../index.css'; // make sure this includes heatmap CSS

export default function Problems() {
  const [problems, setProblems] = useState([]);

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

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Problems</h2>
        <div className="border p-3 bg-gray-50 rounded shadow-sm">
          <h3 className="text-sm text-center font-semibold mb-1">Practice Streak</h3>
          <CalendarHeatmap
            startDate={subDays(new Date(), 100)}
            endDate={new Date()}
            values={streakData}
            classForValue={getColorClass}
            showWeekdayLabels={false}
          />
        </div>
      </div>

      {/* Problems Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Difficulty</th>
              <th className="py-2 px-4">Tags</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem.id?.$oid || problem.id}>
                <td className="py-2 px-4 text-blue-600 hover:underline">
                  <Link to={`/problems/${problem._id?.$oid || problem.id}`}>
                    {problem.title}
                  </Link>
                </td>
                <td className="py-2 px-4">
                  <span className={
                    problem.difficulty === 'Easy'
                      ? 'text-green-600'
                      : problem.difficulty === 'Medium'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }>
                    {problem.difficulty || 'Medium'}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {problem.tags?.join(', ') || 'General'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
