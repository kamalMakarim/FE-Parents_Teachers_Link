import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../../API_URL";
import deleteSVG from "../../../assets/teacher/delete.svg";
import editSVG from "../../../assets/teacher/edit.svg";

const ManageUserPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/user/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleDelete = (username) => {
    setLoading(true);

    axios
      .delete(`${API_URL}/user/delete/${username}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setUsers(users.filter((user) => user.username !== username));
        setFilteredUsers(
          filteredUsers.filter((user) => user.username !== username)
        );
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleSaveEdit = (user, password) => {
    axios
      .put(
        `${API_URL}/user/update-password`,
        {
          username: user.username,
          new_password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.message === "Password updated successfully") {
          setShowEditPopup(false);
        } else {
          setMessage("Failed to update password");
        }
      })
      .catch((error) => {
        if (error.response.data.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage("Failed to update password");
        }
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
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded-md py-2 px-3 mb-2"
          onChange={handleSearch}
        />
        <div className="flex overflow-auto flex-col h-[60vh]">
          {loading ? (
            <p>Loading...</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.username}
                className="mb-4 bg-gray-200 flex flex-row rounded-lg p-2 items-center"
              >
                <div className="flex flex-row">
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold">
                      {user.username} ({user.role})
                    </h2>
                    <p className="text-gray-500">
                      Display name: {user.display_name}
                    </p>
                    {user.role === "teacher" ? (
                      <p className="text-gray-500">Class: {user.class_name}</p>
                    ) : (
                      <>
                        {user.students &&
                          Array.isArray(user.students) &&
                          user.students.map((student) => (
                            <p key={student.id} className="text-gray-500">
                              {student.name}
                            </p>
                          ))}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-end ml-auto">
                  <img
                    src={editSVG}
                    alt="Edit"
                    className="w-6 h-6 cursor-pointer mr-2"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowEditPopup(true);
                    }}
                  />
                  <img
                    src={deleteSVG}
                    alt="Delete"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this user?")) {
                        handleDelete(user.username);
                      }
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {showEditPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Edit Password</h2>
            <input
              type="text"
              placeholder="Password"
              className="border border-gray-300 rounded-md py-2 px-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md"
              onClick={() => handleSaveEdit(selectedUser, password)}
            >
              Save
            </button>
            <h1 className="text-red-500">{message}</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUserPage;
