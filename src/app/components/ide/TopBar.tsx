import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { useTheme } from "../ThemeProvider";
import { 
  Moon, 
  Sun, 
  LogOut, 
  User, 
  CheckSquare,
  Code2,
  Menu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";

interface TopBarProps {
  user: any;
  onNavigate: () => void;
}

export function TopBar({ user, onNavigate }: TopBarProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem("welcomeShown");
    if (!hasShownWelcome) {
      toast.success(`Welcome back, ${user.name}!`, {
        duration: 3000,
      });
      sessionStorage.setItem("welcomeShown", "true");
    }
  }, [user.name]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("welcomeShown");
    navigate("/");
  };

  return (
    <div className="h-9 bg-[#323233] dark:bg-[#323233] flex items-center justify-between px-2 border-b border-[#1e1e1e]">
      {/* Left side - Logo and Menu */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-2">
          <div className="w-5 h-5 bg-[#0e639c] rounded flex items-center justify-center">
            <Code2 className="h-3 w-3 text-white" />
          </div>
          <span className="text-xs font-semibold text-gray-200">CodePlayground</span>
        </div>
        
        <div className="hidden md:flex items-center">
          <Button
            variant="ghost"
            className="h-7 px-3 text-xs text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
          >
            File
          </Button>
          <Button
            variant="ghost"
            className="h-7 px-3 text-xs text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            className="h-7 px-3 text-xs text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
          >
            View
          </Button>
          <Button
            variant="ghost"
            className="h-7 px-3 text-xs text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
            onClick={onNavigate}
          >
            Tasks
          </Button>
        </div>
      </div>

      {/* Right side - User menu */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-7 w-7 text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 gap-2 text-xs text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
            >
              <User className="h-3 w-3" />
              <span className="hidden sm:inline">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end"
            className="bg-[#3c3c3c] border-[#454545] text-gray-200"
          >
            <DropdownMenuItem 
              onClick={onNavigate}
              className="hover:bg-[#2a2d2e] focus:bg-[#2a2d2e]"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Tasks
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#454545]" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="hover:bg-[#2a2d2e] focus:bg-[#2a2d2e]"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
