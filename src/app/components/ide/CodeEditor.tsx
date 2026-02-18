import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { FileNode } from "../IDEWorkspace";

interface CodeEditorProps {
  file: FileNode | null;
  onUpdate: (fileId: string, content: string) => void;
  theme: string;
}

export function CodeEditor({ file, onUpdate, theme }: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (value: string | undefined) => {
    if (file && value !== undefined) {
      onUpdate(file.id, value);
    }
  };

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-gray-950 text-gray-400">
        <div className="text-center">
          <p>Select a file to start editing</p>
          <p className="text-sm mt-2">or create a new file from the explorer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={file.language}
        value={file.content || ""}
        onChange={handleEditorChange}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
        }}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
}
