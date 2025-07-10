import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, setCode }) {
  return (
    <div className="border rounded overflow-hidden">
      <Editor
        height="400px"
        defaultLanguage="java"
        value={code}
        onChange={(value) => setCode(value || '')}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
