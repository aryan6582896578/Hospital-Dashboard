// import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import HomePage from "./components/HomePage";
import { AuthPage } from "./components/AuthPage.tsx";
import { DashboardPage } from "./components/DashboardPage";
import { ErrorPage } from "./components/ErrorPage.tsx";
import { AdminPage } from "./components/AdminComponents/AdminPage.tsx";
import { ManageUserPage } from "./components/AdminComponents/ManageUserPage.tsx";
import { ManageHospitalPage } from "./components/AdminComponents/ManageHospitalPage.tsx";
import { HospitalPage } from "./components/DashboardComponents/HospitalPage.tsx";
import AddPaitentPage from "./components/DashboardComponents/AddPaitentPage.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },{
    path:"dashboard",
    Component: AuthPage,
    children: [
      // {path:":hospitalname",
      //   Component: HospitalPage,
      //   children:[
      //     {path:":user",
      //     Component: AddPaitentPage}
      //   ]
      // },
      {path:":hospitalname",Component: HospitalPage},
      {path:":hospitalname/:user",Component: AddPaitentPage},
      { index: true, 
        Component: DashboardPage },
      { path: "admin", 
        Component: AdminPage,
        children:[
          {path:"manageuser", Component: ManageUserPage},
          {path:"managehospital", Component: ManageHospitalPage},
        ] },
      
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
