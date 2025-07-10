import { useState } from 'react';
import CodeEditor from '../components/editor/CodeEditor';
import { runCode } from '../services/api';

export default function Home() {
  const [code, setCode] = useState(`public class Main {
  public static void main(String[] args) {
    System.out.println("Hello");
  }
}`);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleRun = async () => {
    setOutput('');
    setError('');
    try {
      const res = await runCode({ code, input });
      setOutput(res.data.output || res.data);
    } catch (err) {
      console.error("❌ Run Code Error:", err);
      setError('Error running code.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="text-center py-20 bg-white shadow">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">CodeJudge Playground</h1>
        <p className="text-gray-600 text-lg">
          Your personalized environment to write, run, and test code. Have FUN !!
        </p>
        <a href="#playground" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
          Try It Now
        </a>
      </section>

      {/* Playground Section */}
      <section id="playground" className="max-w-6xl mx-auto mt-12 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Playground</h2>

        <div className="mb-4">
          <CodeEditor code={code} setCode={setCode} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border p-3 rounded font-mono text-sm bg-gray-50"
            rows={4}
            placeholder="Optional Input"
          />

          <div className="bg-gray-50 border p-3 rounded font-mono text-sm min-h-[100px]">
            {output && (
              <>
                <strong className="text-green-700">Output:</strong>
                <pre className="whitespace-pre-wrap text-gray-800">{output}</pre>
              </>
            )}
            {error && (
              <>
                <strong className="text-red-700">Error:</strong>
                <pre className="text-red-500">{error}</pre>
              </>
            )}
          </div>
        </div>

        <div className="text-right mt-6">
          <button
            onClick={handleRun}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Run Code
          </button>
        </div>
      </section>
    </div>
  );
}
