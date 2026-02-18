import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { AuthPage } from "./components/AuthPage";
import { IDEWorkspace } from "./components/IDEWorkspace";
import { TodoApp } from "./components/TodoApp";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: AuthPage },
      { path: "ide", Component: IDEWorkspace },
      { path: "todo", Component: TodoApp },
    ],
  },
]);
