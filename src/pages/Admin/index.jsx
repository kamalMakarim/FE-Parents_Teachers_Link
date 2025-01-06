import React, { useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../API_URL";

const AdminPage = () => {
  const handleDeleteAllLogs = async () => {
    await axios
      .delete(`${API_URL}/log/deleteAll`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        alert("Logs deleted successfully!");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="bg-[#00AFEF] min-h-screen flex flex-col">
      <div className="pt-10 pl-10">
        <h1 className="font-poppins text-white">Hello,</h1>
        <h1 className="font-poppins text-white font-bold">
          {localStorage.getItem("display_name")}
        </h1>
      </div>
      <div className="flex flex-col mt-5 bg-white rounded-t-2xl p-10 flex-grow">
        <button onClick={() => window.location.href = '/admin/add-user'}  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Add User
        </button>
        <button onClick={() => window.location.href = '/admin/add-student'} c className="bg-blue-500 hover:bg-blue-600 mt-5 text-white font-bold py-2 px-4 rounded">
          Add Student
        </button>
        <button onClick={() => window.location.href = '/admin/manage-users'} className="bg-blue-500 hover:bg-blue-600 mt-5 text-white font-bold py-2 px-4 rounded">
          Manage Users
        </button>
        <button onClick={() => window.location.href = '/admin/manage-students'} className="bg-blue-500 hover:bg-blue-600 mt-5 text-white font-bold py-2 px-4 rounded">
          Manage Students
        </button>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete all logs?")) {
              handleDeleteAllLogs();
            }
          }}
          className="bg-red-500 hover:bg-red-600 mt-5 text-white font-bold py-2 px-4 rounded"
        >
          Delete All Logs
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
