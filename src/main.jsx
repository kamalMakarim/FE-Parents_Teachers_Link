import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import "./index.css"
import App from "./App"
import LoginPage from "./pages/Login/index.jsx"
import AdminPage from "./pages/Admin/index.jsx"
import TeacherPage from "./pages/Teacher/index.jsx"
import TeacherBidangStudy from "./pages/Teacher/BidangStudy/index.jsx"
import AddLogPageBidangStudy from "./pages/Teacher/BidangStudy/Add-Log/index.jsx"
import ParentPage from "./pages/Parent/index.jsx"
import AddLogPage from "./pages/Teacher/Add-Log/index.jsx"
import ProfilePage from "./pages/Profile/index.jsx"
import AddUserPage from "./pages/Admin/AddUser/index.jsx"
import AddStudentPage from "./pages/Admin/AddStudent/index.jsx"
import ManageUserPage from "./pages/Admin/ManageUser/index.jsx"
import ManageStudentPage from "./pages/Admin/ManageStudent/index.jsx"

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
      },
      {
        path: "/teacher",
        element: <TeacherPage />,
      },
      {
        path: "/teacher/add-log",
        element: <AddLogPage />,
      },
      {
        path: "/teacher/bidang-study/add-log",
        element: <AddLogPageBidangStudy />,
      },
      {
        path: "/teacher/bidang-study",
        element: <TeacherBidangStudy />,
      },
      {
        path: "/parent",
        element: <ParentPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/admin/add-user",
        element: <AddUserPage />,
      },
      {
        path:"/admin/add-student",
        element:<AddStudentPage />,
      },
      {
        path:"/admin/manage-users",
        element:<ManageUserPage />,
      },
      {
        path:"/admin/manage-students",
        element:<ManageStudentPage />,
      },
      
    ],

  },
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
  );
}