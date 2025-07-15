import { useEffect, useState } from "react";
import { fetchSubmissions, fetchProblems } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const { username: viewedUser } = useParams();
  const { user } = useAuth();
  const actualUser = viewedUser || user?.username;
  const isOwner = user?.username === actualUser;

  const [submissions, setSubmissions] = useState([]);
  const [difficultyCount, setDifficultyCount] = useState({
    Easy: 0,
    Medium: 0,
    Hard: 0,
  });
  const [activityMap, setActivityMap] = useState({});
  const [recentSolved, setRecentSolved] = useState([]);

  const [editing, setEditing] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [socials, setSocials] = useState({ github: "", linkedin: "" });
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("profile_" + actualUser)) || {};
    setProfilePic(storedProfile.profilePic || "");
    setSocials(storedProfile.socials || { github: "", linkedin: "" });

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
          (sub) => sub.username === actualUser && sub.status === "Success"
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

        setSubmissions(Object.keys(uniqueSolvedMap));
        setActivityMap(activity);
        setDifficultyCount(difficultyCounter);
        setRecentSolved(recent);
      } catch (err) {
        console.error("❌ Failed to load dashboard data", err);
      }
    };

    if (actualUser) load();
  }, [actualUser]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "iyiuzq8w");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dc8trwtsx/image/upload",
        formData
      );
      const url = res.data.secure_url;
      setProfilePic(url);

      const updated = {
        profilePic: url,
        socials,
      };
      localStorage.setItem("profile_" + actualUser, JSON.stringify(updated));
    } catch (err) {
      console.error("❌ Upload failed", err);
    }
  };

  const handleSave = () => {
    const updated = {
      profilePic,
      socials,
    };
    localStorage.setItem("profile_" + actualUser, JSON.stringify(updated));
    setEditing(false);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/dashboard/${actualUser}`;
    navigator.clipboard.writeText(shareUrl);
    setShareMessage("🔗 Profile link copied!");
    setTimeout(() => setShareMessage(""), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Profile Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <img
              src={profilePic || "/default-avatar.png"}
              alt="Profile"
              className="w-20 h-20 rounded-full border object-cover"
            />
            {isOwner && (
              <input
                type="file"
                accept="image/*"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleUpload}
              />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{actualUser}</h2>
            {editing ? (
              <div className="space-x-2 mt-2">
                <input
                  type="text"
                  placeholder="GitHub"
                  className="border p-1 rounded text-sm"
                  value={socials.github}
                  onChange={(e) =>
                    setSocials({ ...socials, github: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="LinkedIn"
                  className="border p-1 rounded text-sm"
                  value={socials.linkedin}
                  onChange={(e) =>
                    setSocials({ ...socials, linkedin: e.target.value })
                  }
                />
              </div>
            ) : (
              <div className="text-sm text-gray-600 mt-1 space-x-4">
                {socials.github && (
                  <a
                    href={socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-600"
                  >
                    GitHub
                  </a>
                )}
                {socials.linkedin && (
                  <a
                    href={socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-600"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          {isOwner && (
            editing ? (
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
            )
          )}
          <button
            onClick={handleShare}
            className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
          >
            Share
          </button>
        </div>
      </div>
      {shareMessage && (
        <div className="text-green-600 font-medium mb-4">{shareMessage}</div>
      )}

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

      {/* Recently Solved */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Recently Solved</h3>
        {recentSolved.length === 0 ? (
          <p className="text-gray-500">You haven’t solved any problems yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentSolved.map((p, i) => (
              <li key={i} className="flex justify-between items-center border-b pb-2">
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