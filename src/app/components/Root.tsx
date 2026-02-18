import { Outlet } from "react-router";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "./ui/sonner";

export function Root() {
  return (
    <ThemeProvider>
      <Outlet />
      <Toaster />
    </ThemeProvider>
  );
}
