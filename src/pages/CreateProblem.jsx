import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CreateProblem() {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [tags, setTags] = useState('');
  const [examples, setExamples] = useState([{ input: '', output: '' }]);
  const [message, setMessage] = useState('');

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center text-red-600 font-semibold">
        ❌ You are not authorized to access this page.
      </div>
    );
  }

  const handleAddExample = () => {
    setExamples([...examples, { input: '', output: '' }]);
  };

  const handleChangeExample = (index, field, value) => {
    const updated = [...examples];
    updated[index][field] = value;
    setExamples(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !examples[0]?.input || !examples[0]?.output) {
      setMessage('❌ Please fill out all required fields');
      return;
    }

    const problemData = {
      title,
      description,
      difficulty,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      sampleInput: examples[0]?.input || '',
      sampleOutput: examples[0]?.output || '',
    };

    try {
      await axios.post('http://localhost:9090/problems', problemData);

      setMessage('✅ Problem added!');
      setTitle('');
      setDescription('');
      setDifficulty('Easy');
      setTags('');
      setExamples([{ input: '', output: '' }]);
    } catch (err) {
      setMessage('❌ Failed to add problem');
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">📝 Create New Problem</h2>

      <form onSubmit={handleSubmit}>
        <label className="block font-medium mb-1">Title *</label>
        <input
          className="w-full border p-2 mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter problem title"
          required
        />

        <label className="block font-medium mb-1">Description *</label>
        <textarea
          className="w-full border p-2 mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Describe the problem in detail"
          required
        />

        <label className="block font-medium mb-1">Difficulty</label>
        <select
          className="w-full border p-2 mb-4"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <label className="block font-medium mb-1">Tags (comma separated)</label>
        <input
          className="w-full border p-2 mb-4"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., Array, Dynamic Programming"
        />

        <label className="block font-medium mb-2">Examples *</label>
        {examples.map((ex, i) => (
          <div key={i} className="mb-4">
            <input
              className="w-full border p-2 mb-2"
              placeholder="Sample Input"
              value={ex.input}
              onChange={(e) => handleChangeExample(i, 'input', e.target.value)}
              required
            />
            <input
              className="w-full border p-2"
              placeholder="Expected Output"
              value={ex.output}
              onChange={(e) => handleChangeExample(i, 'output', e.target.value)}
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddExample}
          className="mb-4 text-blue-500 underline"
        >
          ➕ Add Another Example
        </button>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Problem
        </button>
      </form>

      {message && <p className="mt-4 font-medium">{message}</p>}
    </div>
  );
}