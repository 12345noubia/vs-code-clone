import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { FileExplorer } from "./ide/FileExplorer";
import { CodeEditor } from "./ide/CodeEditor";
import { TopBar } from "./ide/TopBar";
import { AIAssistant } from "./ide/AIAssistant";
import { StatusBar } from "./ide/StatusBar";
import { useTheme } from "./ThemeProvider";
import { useIsMobile } from "../hooks/useIsMobile";
import { 
  PanelLeft, 
  Play,
  X,
  Settings,
  Search,
  GitBranch,
  Bug,
  Box,
  ChevronDown
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  language?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

const DEFAULT_FILES: FileNode[] = [
  {
    id: "root",
    name: "my-project",
    type: "folder",
    isOpen: true,
    children: [
      {
        id: "1",
        name: "index.html",
        type: "file",
        language: "html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Dashboard</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="logo">
                <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
                <h1>CodePlayground</h1>
            </div>
            <nav class="nav">
                <a href="#" class="nav-link active">Dashboard</a>
                <a href="#" class="nav-link">Projects</a>
                <a href="#" class="nav-link">Settings</a>
            </nav>
            <button class="btn-primary">Get Started</button>
        </header>

        <main class="main">
            <section class="hero">
                <div class="badge">NEW: Built for Smart Teams</div>
                <h2 class="hero-title">Build Amazing Things</h2>
                <p class="hero-subtitle">The most powerful code editor with AI assistance</p>
                <div class="hero-actions">
                    <button class="btn-large btn-primary">Start Coding</button>
                    <button class="btn-large btn-secondary">View Demo</button>
                </div>
            </section>

            <section class="features">
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>Lightning Fast</h3>
                    <p>Experience blazing fast performance</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🤖</div>
                    <h3>AI Powered</h3>
                    <p>Get intelligent code suggestions</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎨</div>
                    <h3>Beautiful UI</h3>
                    <p>Work in a stunning environment</p>
                </div>
            </section>
        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: "2",
        name: "styles.css",
        type: "file",
        language: "css",
        content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #1a202c;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

/* Header Styles */
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 40px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    margin-bottom: 40px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo-icon {
    width: 32px;
    height: 32px;
    color: #667eea;
}

.logo h1 {
    font-size: 24px;
    font-weight: 700;
    color: #1a202c;
}

.nav {
    display: flex;
    gap: 32px;
}

.nav-link {
    text-decoration: none;
    color: #4a5568;
    font-weight: 500;
    transition: color 0.2s;
}

.nav-link:hover,
.nav-link.active {
    color: #667eea;
}

.btn-primary {
    padding: 12px 24px;
    background: #1a202c;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Hero Section */
.main {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 60px 40px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.hero {
    text-align: center;
    margin-bottom: 60px;
}

.badge {
    display: inline-block;
    padding: 8px 16px;
    background: #1a202c;
    color: white;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 24px;
}

.hero-title {
    font-size: 56px;
    font-weight: 800;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.hero-subtitle {
    font-size: 20px;
    color: #4a5568;
    margin-bottom: 32px;
}

.hero-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
}

.btn-large {
    padding: 16px 32px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-secondary {
    background: transparent;
    color: #1a202c;
    border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
    background: #f7fafc;
}

/* Features Section */
.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
}

.feature-card {
    padding: 32px;
    background: #f7fafc;
    border-radius: 12px;
    text-align: center;
    transition: transform 0.2s;
}

.feature-card:hover {
    transform: translateY(-4px);
}

.feature-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.feature-card h3 {
    font-size: 20px;
    margin-bottom: 8px;
    color: #1a202c;
}

.feature-card p {
    color: #4a5568;
}

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        gap: 20px;
    }
    
    .hero-title {
        font-size: 36px;
    }
    
    .hero-actions {
        flex-direction: column;
    }
}`,
      },
      {
        id: "3",
        name: "script.js",
        type: "file",
        language: "javascript",
        content: `// Modern JavaScript with animations
console.log('🚀 CodePlayground initialized!');

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animated counter
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// Button ripple effect
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

console.log('✨ All animations loaded successfully!');`,
      },
      {
        id: "4",
        name: "README.md",
        type: "file",
        language: "markdown",
        content: `# My Awesome Project

Welcome to my project built with CodePlayground!

## Features

- Modern and responsive design
- Beautiful animations
- Clean and maintainable code

## Getting Started

1. Edit the files in the explorer
2. Click "Run Code" to preview
3. Use the AI Assistant for help

Happy coding! 🚀`,
      },
    ],
  },
];

export function IDEWorkspace() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<any>(null);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [activityBar, setActivityBar] = useState<"explorer" | "search" | "git" | "extensions">("explorer");
  const previewWindowRef = useRef<Window | null>(null);

  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(currentUser));

    const userFiles = localStorage.getItem("userFiles");
    if (userFiles) {
      setFiles(JSON.parse(userFiles));
    } else {
      setFiles(DEFAULT_FILES);
      localStorage.setItem("userFiles", JSON.stringify(DEFAULT_FILES));
    }
  }, [navigate]);

  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem("userFiles", JSON.stringify(files));
    }
  }, [files]);

  const handleFileSelect = (file: FileNode) => {
    if (file.type === "file") {
      setActiveFile(file);
      if (!openFiles.find(f => f.id === file.id)) {
        setOpenFiles([...openFiles, file]);
      }
    }
  };

  const handleCloseFile = (fileId: string) => {
    const newOpenFiles = openFiles.filter(f => f.id !== fileId);
    setOpenFiles(newOpenFiles);
    if (activeFile?.id === fileId) {
      setActiveFile(newOpenFiles[newOpenFiles.length - 1] || null);
    }
  };

  const handleFileUpdate = (fileId: string, newContent: string) => {
    const updateFiles = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === fileId) {
          return { ...node, content: newContent };
        }
        if (node.children) {
          return { ...node, children: updateFiles(node.children) };
        }
        return node;
      });
    };

    const updatedFiles = updateFiles(files);
    setFiles(updatedFiles);

    if (activeFile?.id === fileId) {
      setActiveFile({ ...activeFile, content: newContent });
    }

    // Update in openFiles
    setOpenFiles(openFiles.map(f => 
      f.id === fileId ? { ...f, content: newContent } : f
    ));

    if (previewWindowRef.current && !previewWindowRef.current.closed) {
      runCode();
    }
  };

  const handleCreateFile = (parentId: string, name: string, type: "file" | "folder") => {
    const newNode: FileNode = {
      id: Date.now().toString(),
      name,
      type,
      content: type === "file" ? "" : undefined,
      language: getLanguageFromExtension(name),
      children: type === "folder" ? [] : undefined,
    };

    const addNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), newNode],
            isOpen: true,
          };
        }
        if (node.children) {
          return { ...node, children: addNode(node.children) };
        }
        return node;
      });
    };

    setFiles(addNode(files));
    toast.success(`${type === "file" ? "File" : "Folder"} created`);
  };

  const handleRenameFile = (fileId: string, newName: string) => {
    const renameNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === fileId) {
          return { ...node, name: newName, language: getLanguageFromExtension(newName) };
        }
        if (node.children) {
          return { ...node, children: renameNode(node.children) };
        }
        return node;
      });
    };

    setFiles(renameNode(files));
    if (activeFile?.id === fileId) {
      setActiveFile({ ...activeFile, name: newName });
    }
    setOpenFiles(openFiles.map(f => 
      f.id === fileId ? { ...f, name: newName } : f
    ));
    toast.success("File renamed");
  };

  const handleDeleteFile = (fileId: string) => {
    const deleteNode = (nodes: FileNode[]): FileNode[] => {
      return nodes
        .filter((node) => node.id !== fileId)
        .map((node) => {
          if (node.children) {
            return { ...node, children: deleteNode(node.children) };
          }
          return node;
        });
    };

    setFiles(deleteNode(files));
    if (activeFile?.id === fileId) {
      setActiveFile(null);
    }
    setOpenFiles(openFiles.filter(f => f.id !== fileId));
    toast.success("Deleted");
  };

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      html: "html",
      htm: "html",
      css: "css",
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      c: "c",
      cpp: "cpp",
      h: "c",
      hpp: "cpp",
      md: "markdown",
      json: "json",
    };
    return languageMap[ext || ""] || "plaintext";
  };

  const runCode = () => {
    const getAllFiles = (nodes: FileNode[]): FileNode[] => {
      let allFiles: FileNode[] = [];
      nodes.forEach((node) => {
        if (node.type === "file") {
          allFiles.push(node);
        }
        if (node.children) {
          allFiles = [...allFiles, ...getAllFiles(node.children)];
        }
      });
      return allFiles;
    };

    const allFiles = getAllFiles(files);
    const htmlFile = allFiles.find((f) => f.language === "html");
    const cssFiles = allFiles.filter((f) => f.language === "css");
    const jsFiles = allFiles.filter((f) => f.language === "javascript");

    if (!htmlFile) {
      toast.error("No HTML file found to run");
      return;
    }

    let htmlContent = htmlFile.content || "";
    
    const cssContent = cssFiles.map((f) => f.content).join("\n");
    if (cssContent) {
      htmlContent = htmlContent.replace(
        "</head>",
        `<style>${cssContent}</style></head>`
      );
    }

    const jsContent = jsFiles.map((f) => f.content).join("\n");
    if (jsContent) {
      htmlContent = htmlContent.replace(
        "</body>",
        `<script>${jsContent}</script></body>`
      );
    }

    if (previewWindowRef.current && !previewWindowRef.current.closed) {
      previewWindowRef.current.close();
    }

    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      previewWindowRef.current = newWindow;
      toast.success("Preview opened in new tab");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] dark:bg-[#1e1e1e]">
      <TopBar user={user} onNavigate={() => navigate("/todo")} />

      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] dark:bg-[#333333] flex flex-col items-center py-2 gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-10 h-10 ${activityBar === "explorer" ? "bg-[#1e1e1e]" : ""} hover:bg-[#2a2a2a] text-gray-300`}
                  onClick={() => {
                    setActivityBar("explorer");
                    setSidebarCollapsed(false);
                  }}
                >
                  <Box className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Explorer</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-10 h-10 ${activityBar === "search" ? "bg-[#1e1e1e]" : ""} hover:bg-[#2a2a2a] text-gray-300`}
                  onClick={() => setActivityBar("search")}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Search</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-10 h-10 ${activityBar === "git" ? "bg-[#1e1e1e]" : ""} hover:bg-[#2a2a2a] text-gray-300`}
                  onClick={() => setActivityBar("git")}
                >
                  <GitBranch className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Source Control</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-10 h-10 ${activityBar === "extensions" ? "bg-[#1e1e1e]" : ""} hover:bg-[#2a2a2a] text-gray-300`}
                  onClick={() => setActivityBar("extensions")}
                >
                  <Bug className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Run & Debug</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex-1" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 hover:bg-[#2a2a2a] text-gray-300"
                  onClick={() => setShowAIChat(!showAIChat)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">AI Assistant</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Sidebar */}
        {!sidebarCollapsed && activityBar === "explorer" && (
          <div className="w-64 bg-[#252526] dark:bg-[#252526] border-r border-[#1e1e1e] flex flex-col">
            <div className="px-4 py-2 flex items-center justify-between border-b border-[#1e1e1e]">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Explorer
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-300"
                onClick={() => setSidebarCollapsed(true)}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>
            <FileExplorer
              files={files}
              activeFile={activeFile}
              onFileSelect={handleFileSelect}
              onCreateFile={handleCreateFile}
              onRenameFile={handleRenameFile}
              onDeleteFile={handleDeleteFile}
            />
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
          {/* File Tabs */}
          {openFiles.length > 0 && (
            <div className="flex items-center bg-[#252526] border-b border-[#1e1e1e] overflow-x-auto">
              {openFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center gap-2 px-4 py-2 border-r border-[#1e1e1e] cursor-pointer group min-w-[120px] ${
                    activeFile?.id === file.id
                      ? "bg-[#1e1e1e] text-white"
                      : "bg-[#2d2d2d] text-gray-400 hover:bg-[#2a2a2a]"
                  }`}
                  onClick={() => setActiveFile(file)}
                >
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseFile(file.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:bg-[#3e3e3e] rounded p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Toolbar */}
          <div className="bg-[#252526] border-b border-[#1e1e1e] px-4 py-2 flex items-center gap-2">
            <Button
              onClick={runCode}
              size="sm"
              className="bg-[#0e639c] hover:bg-[#1177bb] text-white h-7 text-xs"
            >
              <Play className="h-3 w-3 mr-1" />
              Run Code
            </Button>
            {activeFile && (
              <span className="text-xs text-gray-400 ml-auto">
                {activeFile.language} • Line 1, Col 1
              </span>
            )}
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              file={activeFile}
              onUpdate={handleFileUpdate}
              theme={theme}
            />
          </div>

          {/* Status Bar */}
          <StatusBar activeFile={activeFile} />
        </div>

        {/* AI Chat Panel */}
        {showAIChat && (
          <div className="w-80 bg-[#252526] border-l border-[#1e1e1e] flex flex-col">
            <div className="px-4 py-2 flex items-center justify-between border-b border-[#1e1e1e]">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                AI Assistant
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-300"
                onClick={() => setShowAIChat(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <AIAssistant />
          </div>
        )}
      </div>
    </div>
  );
}
