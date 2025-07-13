import { useEffect, useState } from "react";
import { fetchSubmissions, fetchProblems } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [problemMap, setProblemMap] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const [subsRes, probsRes] = await Promise.all([
          fetchSubmissions(),
          fetchProblems()
        ]);

        const problems = probsRes.data;
        const submissions = subsRes.data.filter(
          (sub) => sub.username === user?.username
        );

        const problemDifficultyMap = {};
        problems.forEach(p => {
          problemDifficultyMap[p.title] = p.difficulty;
        });

        const sorted = [...submissions].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setProblemMap(problemDifficultyMap);
        setSubmissions(sorted);
      } catch (err) {
        console.error("❌ Failed to fetch submissions or problems", err);
      }
    };

    if (user) load();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">📄 My Submissions</h2>

      {submissions.length === 0 ? (
        <p className="text-gray-500">No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">#</th>
                <th className="p-2">Problem</th>
                <th className="p-2">Difficulty</th>
                <th className="p-2">Status</th>
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, index) => {
                const difficulty = problemMap[sub.problemTitle] || "Unknown";

                return (
                  <tr key={sub.id || index} className="border-t hover:bg-gray-50">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{sub.problemTitle}</td>
                    <td className="p-2">
                      <span
                        className={
                          difficulty === "Easy"
                            ? "text-green-600"
                            : difficulty === "Medium"
                            ? "text-yellow-600"
                            : difficulty === "Hard"
                            ? "text-red-600"
                            : "text-gray-500"
                        }
                      >
                        {difficulty}
                      </span>
                    </td>
                    <td className="p-2">
                      {sub.status === "Success" ? (
                        <span className="text-green-600 font-semibold">✅ Success</span>
                      ) : (
                        <span className="text-red-600 font-semibold">❌ Failed</span>
                      )}
                    </td>
                    <td className="p-2 text-sm text-gray-500">
                      {new Date(sub.timestamp).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}