// import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import HomePage from "./components/HomePage";
import { AuthPage } from "./components/AuthPage.tsx";
import { DashboardPage } from "./components/DashboardPage";
import { ErrorPage } from "./components/ErrorPage.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
  },{
    path:"/dashboard",
    Component: AuthPage,
    children: [
      { path: "", Component: DashboardPage },
    ],
  },{
    path:"*",
    Component: ErrorPage,
  }
]);

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);
