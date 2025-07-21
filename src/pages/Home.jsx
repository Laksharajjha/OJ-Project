import { useState, useEffect } from 'react';
import CodeEditor from '../components/editor/CodeEditor';
import { executeCode } from '../services/api';
import { motion } from 'framer-motion';

const boilerplateMap = {
  java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, Java!");
  }
}`,
  python: `print("Hello, Python!")`
};

export default function Home() {
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState(boilerplateMap['java']);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  // Update code when language changes
  useEffect(() => {
    setCode(boilerplateMap[language]);
  }, [language]);

  const handleRun = async () => {
    setOutput('');
    setError('');
    try {
      const res = await executeCode({ code, input, language });
      setOutput(res.data.output || res.data);
    } catch (err) {
      console.error("❌ Run Code Error:", err);
      setError('❌ Error running code.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-20 bg-white shadow-lg"
      >
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-3 tracking-tight">🚀 CodeJudge Playground</h1>
        <p className="text-gray-600 text-lg font-medium">
          Your personalized space to write, run, and test code with ease!
        </p>
        <a
          href="#playground"
          className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
        >
          Try It Now
        </a>
      </motion.section>

      {/* Playground Section */}
      <motion.section
        id="playground"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-6xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-indigo-800">🧪 Playground</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none"
          >
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>

        <div className="mb-4">
          <CodeEditor code={code} setCode={setCode} language={language} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded font-mono text-sm bg-gray-50"
            rows={5}
            placeholder="🔤 Optional Input"
          />

          <div className="bg-gray-100 border border-gray-300 p-3 rounded font-mono text-sm min-h-[100px] whitespace-pre-wrap">
            {output && (
              <>
                <strong className="text-green-700">✅ Output:</strong>
                <pre className="text-gray-800 mt-1">{output}</pre>
              </>
            )}
            {error && (
              <>
                <strong className="text-red-700">❌ Error:</strong>
                <pre className="text-red-600 mt-1">{error}</pre>
              </>
            )}
          </div>
        </div>

        <div className="text-right mt-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleRun}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            ▶️ Run Code
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}
