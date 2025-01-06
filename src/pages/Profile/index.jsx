import React, { useState } from "react";
import editSVG from "../../assets/teacher/edit.svg";
import { API_URL } from "../../../API_URL";
import axios from "axios";

const ProfilePage = () => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("display_name") || ""
  );
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");

  const handleEditNameClick = () => {
    setIsEditingName(true);
  };

  const handleEditPasswordClick = () => {
    setIsEditingPassword(true);
  };

  const handleNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSaveName = async () => {
    // Make a request to the backend to save the new display name
    try {
      const response = await axios.put(
        `${API_URL}/user/update-display-name`,
        { display_name: displayName },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          },
        }
      );
      if (response.status === 200) {
        const result = response.data;
        // Update localStorage with the new display name
        localStorage.setItem("display_name", result.display_name);
        setIsEditingName(false);
        setMessage(result.message);
      } else {
        setMessage("Failed to update profile");
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("Failed to update profile");
      console.error("Error:", error);
    }
  };

  const handleSavePassword = async () => {
    // Make a request to the backend to save the new password
    try {
      const response = await axios.put(
        `${API_URL}/user/update-password`,
        {
          new_password: password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          },
        }
      );

      if (response.status === 200) {
        // Assuming the response contains a message or confirmation
        setIsEditingPassword(false);
        setPassword("");
        setMessage(response.data.message);
      } else {
        setMessage(response.data.message);
        console.error("Failed to update password");
      }
    } catch (error) {
      setMessage("Failed to update password");
      console.error("Error:", error);
    }
  };

  const handleBack = () => {
    if (localStorage.getItem("class_name").startsWith("Bidang Study")) {
      window.location.href = "/teacher/bidang-study";
    } else {
      window.location.href = `/${localStorage.getItem("role")}`;
    }
  }
  return (
    <div className="bg-[#00AFEF] min-h-screen flex flex-col">
      <div className="m-10">
        <h1 className="font-poppins text-white font-bold text-3xl m">
          Edit Profile
        </h1>
      </div>
      <div className="flex flex-col bg-white rounded-t-2xl p-10 flex-grow">
        <h1 className="font-poppins text-black mx-auto text-3xl font-bold">
          {localStorage.getItem("display_name")}
        </h1>
        <div className="flex flex-col mt-5">
          <label className="font-poppins text-gray-800">Display Name</label>
          <div className="flex flex-row items-center">
            <input
              type="text"
              className="border flex-1 border-gray-300 rounded-md p-2 focus:outline-none ring-gray-200 ring-2"
              placeholder="Full Name"
              value={displayName}
              onChange={handleNameChange}
              disabled={!isEditingName}
            />
            {isEditingName ? (
              <button
                className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:cursor-pointer hover:scale-105 transition-all"
                onClick={handleSaveName}
              >
                Save
              </button>
            ) : (
              <img
                className="ml-2 w-6 text-white rounded-md hover:cursor-pointer hover:scale-105 transition-all"
                onClick={handleEditNameClick}
                src={editSVG}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col mt-5">
          <label className="font-poppins text-gray-800">Password</label>
          <div className="flex flex-row items-center">
            <input
              type="password"
              className="border flex-1 border-gray-300 rounded-md p-2 focus:outline-none ring-gray-200 ring-2"
              placeholder="New Password"
              value={password}
              onChange={handlePasswordChange}
              disabled={!isEditingPassword}
            />
            {isEditingPassword ? (
              <button
                className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:cursor-pointer hover:scale-105 transition-all"
                onClick={handleSavePassword}
              >
                Save
              </button>
            ) : (
              <img
                className="ml-2 w-6 text-white rounded-md hover:cursor-pointer hover:scale-105 transition-all"
                onClick={handleEditPasswordClick}
                src={editSVG}
              ></img>
            )}
          </div>
        </div>
        <h1 className="font-poppins mt-3 text-black mx-auto text-2xl">
          {message}
        </h1>

        <div className="mt-auto bg-[#00AFEF] text-white rounded-md hover:bg-[#017aa7] p-2 text-center" onClick={handleBack}>
          Back
        </div>
        
      </div>
      
    </div>
  );
};

export default ProfilePage;
