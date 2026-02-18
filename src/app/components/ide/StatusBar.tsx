import { FileNode } from "../IDEWorkspace";
import { GitBranch, Zap, AlertCircle, Wifi } from "lucide-react";

interface StatusBarProps {
  activeFile: FileNode | null;
}

export function StatusBar({ activeFile }: StatusBarProps) {
  return (
    <div className="h-6 bg-[#007acc] flex items-center justify-between px-3 text-xs text-white">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 cursor-pointer hover:bg-[#005a9e] px-2 py-0.5 rounded">
          <GitBranch className="h-3 w-3" />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          <span>0 errors, 0 warnings</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {activeFile && (
          <span>{activeFile.language?.toUpperCase()}</span>
        )}
        <span>UTF-8</span>
        <span>LF</span>
        <div className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
          <span>Connected</span>
        </div>
      </div>
    </div>
  );
}
