import { useEffect, useState } from "react";
import { fetchSubmissions, fetchProblems } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [difficultyCount, setDifficultyCount] = useState({
    Easy: 0,
    Medium: 0,
    Hard: 0,
  });
  const [activityMap, setActivityMap] = useState({});
  const [recentSolved, setRecentSolved] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [subsRes, probsRes] = await Promise.all([
          fetchSubmissions(),
          fetchProblems(),
        ]);

        const problems = probsRes.data;
        const problemMap = {};
        problems.forEach((p) => {
          problemMap[p.title] = p.difficulty;
        });

        const userSubs = subsRes.data.filter(
          (sub) => sub.username === user?.username && sub.status === "Success"
        );

        const activity = {};
        const uniqueSolvedMap = {};
        const recent = [];
        const difficultyCounter = { Easy: 0, Medium: 0, Hard: 0 };

        const sortedSubs = [...userSubs].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        for (let sub of sortedSubs) {
          const title = sub.problemTitle;
          const dateKey = new Date(sub.timestamp).toISOString().split("T")[0];

          activity[dateKey] = (activity[dateKey] || 0) + 1;

          if (!uniqueSolvedMap[title]) {
            uniqueSolvedMap[title] = true;

            const difficulty = problemMap[title] || "Medium";
            difficultyCounter[difficulty]++;

            if (recent.length < 4) {
              recent.push({ ...sub, difficulty, date: dateKey });
            }
          }
        }

        setSubmissions(Object.keys(uniqueSolvedMap)); // Just keys
        setActivityMap(activity);
        setDifficultyCount(difficultyCounter);
        setRecentSolved(recent);
      } catch (err) {
        console.error("❌ Failed to load dashboard data", err);
      }
    };

    if (user) load();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-6 text-indigo-800">My Analytics</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Solved" value={submissions.length} color="indigo" />
        <StatCard label="Easy" value={difficultyCount.Easy} color="green" />
        <StatCard label="Medium" value={difficultyCount.Medium} color="yellow" />
        <StatCard label="Hard" value={difficultyCount.Hard} color="red" />
      </div>

      {/* Activity Tracker */}
      <div className="bg-white shadow rounded-lg p-4 mb-8">
        <h3 className="text-lg font-semibold mb-4">Activity Tracker</h3>
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {Array.from({ length: 60 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (59 - i));
            const key = date.toISOString().split("T")[0];
            const solved = activityMap[key] || 0;

            const bg =
              solved >= 3
                ? "bg-green-600"
                : solved === 2
                ? "bg-green-400"
                : solved === 1
                ? "bg-green-200"
                : "bg-gray-200";

            return (
              <div
                key={key}
                title={`${key} - ${solved} solved`}
                className={`w-6 h-6 rounded ${bg}`}
              />
            );
          })}
        </div>
      </div>

      {/* Recent Solved */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Recently Solved</h3>
        {recentSolved.length === 0 ? (
          <p className="text-gray-500">You haven’t solved any problems yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentSolved.map((p, i) => (
              <li
                key={i}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <h4 className="font-medium">{p.problemTitle}</h4>
                  <p className="text-xs text-gray-500">{p.date}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    p.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : p.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.difficulty}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorMap = {
    indigo: "text-indigo-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };
  return (
    <div className="bg-white shadow rounded-lg p-4 text-center">
      <h4 className="text-sm font-medium text-gray-600">{label}</h4>
      <p className={`text-2xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
}