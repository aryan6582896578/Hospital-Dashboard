// import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate } from "react-router";
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
import { FinancePage } from "./components/DashboardComponents/FinancePage.tsx";
import { PaitentPage } from "./components/DashboardComponents/PaitentPage.tsx";
import PatientProfilePage from "./components/DashboardComponents/PatientProfilePage.tsx";
import HospitalAuthPage from "./components/DashboardComponents/HospitalAuthPage.tsx";


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
      {path:":hospitalname/finance",Component: FinancePage},
      {path:":hospitalname/patients",Component:HospitalAuthPage,
        children: [
        {
          index: true,
          Component: PaitentPage,
        },
        {
          path: ":patientname",
          Component: PatientProfilePage,
        },
      ],
      },
      { index: true, 
        Component: DashboardPage },
      { path: "admin", 
        Component: AdminPage,
        children:[
          {index: true,element: <Navigate to="/dashboard" replace />},
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
