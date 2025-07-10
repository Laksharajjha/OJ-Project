import { useState } from 'react';
import axios from 'axios';

export default function CreateProblem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [examples, setExamples] = useState([{ input: '', output: '' }]);
  const [message, setMessage] = useState('');

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
    try {
      await axios.post('http://localhost:8080/problems', {
  title,
  description,
  sampleInput: examples[0]?.input || '',
  sampleOutput: examples[0]?.output || '',
});

      setMessage('✅ Problem added!');
      setTitle('');
      setDescription('');
      setExamples([{ input: '', output: '' }]);
    } catch (err) {
      setMessage('❌ Failed to add problem');
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create New Problem</h2>
      <form onSubmit={handleSubmit}>
        <label className="block font-medium">Title</label>
        <input
          className="w-full border p-2 mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="block font-medium">Description</label>
        <textarea
          className="w-full border p-2 mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
        />

        <label className="block font-medium mb-2">Examples</label>
        {examples.map((ex, i) => (
          <div key={i} className="mb-4">
            <input
              className="w-full border p-2 mb-2"
              placeholder="Input"
              value={ex.input}
              onChange={(e) => handleChangeExample(i, 'input', e.target.value)}
            />
            <input
              className="w-full border p-2"
              placeholder="Expected Output"
              value={ex.output}
              onChange={(e) => handleChangeExample(i, 'output', e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddExample}
          className="mb-4 text-blue-500"
        >
          ➕ Add Example
        </button>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
