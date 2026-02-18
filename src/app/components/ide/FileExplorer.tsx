import { useState } from "react";
import { FileNode } from "../IDEWorkspace";
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  FolderOpen,
  Plus,
  Trash2,
  FileCode,
  FileJson,
  Edit3,
  FileCog,
  FileText
} from "lucide-react";
import { Button } from "../ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface FileExplorerProps {
  files: FileNode[];
  activeFile: FileNode | null;
  onFileSelect: (file: FileNode) => void;
  onCreateFile: (parentId: string, name: string, type: "file" | "folder") => void;
  onRenameFile: (fileId: string, newName: string) => void;
  onDeleteFile: (fileId: string) => void;
}

export function FileExplorer({
  files,
  activeFile,
  onFileSelect,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["root"])
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"file" | "folder" | "rename">("file");
  const [dialogParentId, setDialogParentId] = useState("");
  const [dialogFileId, setDialogFileId] = useState("");
  const [newName, setNewName] = useState("");

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const openCreateDialog = (parentId: string, type: "file" | "folder") => {
    setDialogParentId(parentId);
    setDialogType(type);
    setNewName("");
    setDialogOpen(true);
  };

  const openRenameDialog = (fileId: string, currentName: string) => {
    setDialogFileId(fileId);
    setDialogType("rename");
    setNewName(currentName);
    setDialogOpen(true);
  };

  const handleAction = () => {
    if (!newName.trim()) return;

    if (dialogType === "rename") {
      onRenameFile(dialogFileId, newName.trim());
    } else {
      onCreateFile(dialogParentId, newName.trim(), dialogType);
    }
    setDialogOpen(false);
  };

  const getFileIcon = (node: FileNode) => {
    if (node.type === "folder") {
      return expandedFolders.has(node.id) ? (
        <FolderOpen className="h-4 w-4 text-[#dcb67a]" />
      ) : (
        <Folder className="h-4 w-4 text-[#dcb67a]" />
      );
    }

    const ext = node.name.split(".").pop()?.toLowerCase();
    if (ext === "json") return <FileJson className="h-4 w-4 text-[#cbcb41]" />;
    if (ext === "html") return <FileCode className="h-4 w-4 text-[#e34c26]" />;
    if (ext === "css") return <FileCode className="h-4 w-4 text-[#264de4]" />;
    if (["js", "jsx"].includes(ext || "")) return <FileCode className="h-4 w-4 text-[#f0db4f]" />;
    if (["ts", "tsx"].includes(ext || "")) return <FileCode className="h-4 w-4 text-[#007acc]" />;
    if (ext === "py") return <FileCode className="h-4 w-4 text-[#4b8bbe]" />;
    if (["c", "cpp", "h"].includes(ext || "")) return <FileCode className="h-4 w-4 text-[#a8b9cc]" />;
    if (ext === "md") return <FileText className="h-4 w-4 text-[#519aba]" />;
    return <File className="h-4 w-4 text-gray-400" />;
  };

  const renderNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const isActive = activeFile?.id === node.id;

    return (
      <div key={node.id}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer text-sm transition-colors ${
                isActive 
                  ? "bg-[#37373d] text-white" 
                  : "text-gray-300 hover:bg-[#2a2d2e]"
              }`}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              onClick={() => {
                if (node.type === "folder") {
                  toggleFolder(node.id);
                } else {
                  onFileSelect(node);
                }
              }}
            >
              {node.type === "folder" && (
                <span className="flex-shrink-0 text-gray-400">
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </span>
              )}
              {getFileIcon(node)}
              <span className="truncate flex-1">{node.name}</span>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="bg-[#3c3c3c] border-[#454545] text-gray-200">
            {node.type === "folder" && (
              <>
                <ContextMenuItem 
                  onClick={() => openCreateDialog(node.id, "file")}
                  className="hover:bg-[#2a2d2e] focus:bg-[#2a2d2e]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New File
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => openCreateDialog(node.id, "folder")}
                  className="hover:bg-[#2a2d2e] focus:bg-[#2a2d2e]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Folder
                </ContextMenuItem>
                <ContextMenuSeparator className="bg-[#454545]" />
              </>
            )}
            {node.id !== "root" && (
              <>
                <ContextMenuItem
                  onClick={() => openRenameDialog(node.id, node.name)}
                  className="hover:bg-[#2a2d2e] focus:bg-[#2a2d2e]"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Rename
                </ContextMenuItem>
                <ContextMenuSeparator className="bg-[#454545]" />
                <ContextMenuItem
                  onClick={() => onDeleteFile(node.id)}
                  className="text-red-400 hover:bg-[#2a2d2e] focus:bg-[#2a2d2e]"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </ContextMenuItem>
              </>
            )}
          </ContextMenuContent>
        </ContextMenu>

        {node.type === "folder" && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto py-1">
        {files.map((node) => renderNode(node))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#252526] border-[#3c3c3c] text-gray-200">
          <DialogHeader>
            <DialogTitle className="text-white">
              {dialogType === "rename" 
                ? "Rename" 
                : `Create New ${dialogType === "file" ? "File" : "Folder"}`
              }
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {dialogType === "rename"
                ? "Enter a new name"
                : `Enter a name for the new ${dialogType}`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={
                  dialogType === "rename" 
                    ? "new-name" 
                    : dialogType === "file" 
                      ? "filename.js" 
                      : "folder-name"
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAction();
                }}
                className="bg-[#3c3c3c] border-[#454545] text-white"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="bg-transparent border-[#454545] text-gray-300 hover:bg-[#3c3c3c]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAction}
              className="bg-[#0e639c] hover:bg-[#1177bb] text-white"
            >
              {dialogType === "rename" ? "Rename" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
