import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProblemById, runCode, submitSolution } from "../services/api";
import CodeEditor from "../components/editor/CodeEditor";

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(`public class Main {
  public static void main(String[] args) {
    // your code here
  }
}`);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProblemById(id)
      .then((res) => setProblem(res.data))
      .catch((err) => {
        console.error("❌ Failed to fetch problem", err);
      });
  }, [id]);

  const handleRun = async () => {
    setOutput("");
    setError("");
    try {
      const res = await runCode({ code, input });
      setOutput(res.data);
    } catch (err) {
      setError("❌ Error running code.");
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    setOutput("");
    setError("");
    try {
      const res = await runCode({ code, input: problem.sampleInput });
      const actualOutput = (res.data || "").trim();
      const expectedOutput = (problem.sampleOutput || "").trim();
      const status = actualOutput === expectedOutput ? "Success" : "Failed";

      // Save submission
      await submitSolution({
        problemTitle: problem.title,
        code,
        status,
        output: actualOutput,
      });

      setOutput(`✅ Result: ${status}\n\n🧾 Output:\n${actualOutput}`);
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
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{problem.sampleInput || "None"}</pre>
          <strong>Sample Output:</strong>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{problem.sampleOutput || "None"}</pre>
        </div>
      </div>

      {/* RIGHT: Code Editor + Controls */}
      <div className="bg-white p-6 rounded shadow">
        <CodeEditor code={code} setCode={setCode} />

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
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Run Code
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>

        {output && (
          <div className="mt-4 p-4 bg-green-100 rounded whitespace-pre-wrap">
            {output}
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
