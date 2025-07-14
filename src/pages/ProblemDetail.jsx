import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProblemById, runCode, submitSolution } from "../services/api";
import CodeEditor from "../components/editor/CodeEditor";
import { useAuth } from "../context/AuthContext";

const boilerplateMap = {
  java: `public class Main {
  public static void main(String[] args) {
    // your code here
  }
}`,
  cpp: `#include<iostream>
using namespace std;
int main() {
  // your code here
  return 0;
}`,
  python: `# your code here
print("Hello from Python")`,
};

export default function ProblemDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(boilerplateMap["java"]);
  const [input, setInput] = useState("");
  const [outputData, setOutputData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProblemById(id)
      .then((res) => setProblem(res.data))
      .catch((err) => console.error("❌ Failed to fetch problem", err));
  }, [id]);

  useEffect(() => {
    setCode(boilerplateMap[language]);
  }, [language]);

  const handleRun = async () => {
    setOutputData(null);
    setError("");
    try {
      const res = await runCode({
        code,
        input,
        language,
        problemId: problem._id?.$oid || problem._id || problem.id,
      });
      setOutputData(res.data);
    } catch (err) {
      setError("❌ Error running code.");
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    setOutputData(null);
    setError("");

    try {
      const sampleInput = problem.sampleInput || "";
      const expectedOutput = (problem.sampleOutput || "").trim();
      const problemId = problem._id?.$oid || problem._id || problem.id;

      const res = await runCode({
        code,
        input: sampleInput,
        language,
        problemId,
      });

      const data = res.data;
      const actualOutput = (data.output || "").trim();
      const verdict = data.verdict || (actualOutput === expectedOutput ? "Accepted ✅" : "Wrong Answer ❌");

      await submitSolution({
        problemTitle: problem.title,
        code,
        input: sampleInput,
        output: actualOutput,
        expectedOutput,
        verdict,
        status: verdict === "Accepted ✅" ? "Success" : "Failed",
        username: user?.username || "Anonymous",
        timestamp: new Date().toISOString(),
      });

      setOutputData({ output: actualOutput, expectedOutput, verdict });
    } catch (err) {
      setError("❌ Error submitting code.");
      console.error(err);
    }
  };

  if (!problem) return <div className="p-4">Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-7xl mx-auto p-6">
      {/* LEFT: Problem Description */}
      <div className="bg-white p-6 rounded shadow overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
        <p className="whitespace-pre-line mb-4">{problem.description}</p>

        <div className="mb-4">
          <strong>Sample Input:</strong>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
            {problem.sampleInput || "None"}
          </pre>
          <strong>Sample Output:</strong>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
            {problem.sampleOutput || "None"}
          </pre>
        </div>
      </div>

      {/* RIGHT: Code Editor + Controls */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-1 rounded text-sm"
          >
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
        </div>

        <CodeEditor code={code} setCode={setCode} language={language} />

        <textarea
          placeholder="Custom Input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full mt-4 border p-2 rounded font-mono text-sm"
          rows={3}
        />

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleRun}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Run Code
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        </div>

        {/* Output Section */}
        {outputData && (
          <div className="mt-6 border rounded-lg p-4 bg-gray-50 shadow space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-gray-800">📤 Output</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                outputData.verdict.includes("✅") ? "bg-green-100 text-green-700" :
                outputData.verdict.includes("❌") ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {outputData.verdict}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-600 font-semibold mb-1">Your Output:</p>
              <pre className="bg-white border p-2 rounded text-gray-800 whitespace-pre-wrap">
                {outputData.output || "No Output"}
              </pre>
            </div>

            {outputData.expectedOutput && (
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Expected Output:</p>
                <pre className="bg-white border p-2 rounded text-gray-800 whitespace-pre-wrap">
                  {outputData.expectedOutput}
                </pre>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
}