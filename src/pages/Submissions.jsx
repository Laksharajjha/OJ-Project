import { useEffect, useState } from "react";
import { fetchSubmissions } from "../services/api";

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchSubmissions();
        setSubmissions(res.data.reverse()); // show latest first
      } catch (err) {
        console.error("❌ Failed to fetch submissions", err);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">📄 Submissions</h2>
      {submissions.length === 0 ? (
        <p className="text-gray-500">No submissions yet.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">#</th>
              <th className="p-2">Problem</th>
              <th className="p-2">Status</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, index) => (
              <tr key={sub.id || index} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{sub.problemTitle}</td>
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
