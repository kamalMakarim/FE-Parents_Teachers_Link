import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../API_URL";

const AddUserPage = () => {
  const classes = ["Red", "Blue", "Green", "Yellow"];
  const [message, setMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState("parent");

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform the POST request here
    axios
      .post(`${API_URL}/user/add`, {
        username: e.target.username.value,
        display_name: e.target.displayName.value,
        password: e.target.password.value,
        role: selectedRole,
        class_name: selectedRole === "teacher" ? e.target.class.value : null,
      })
      .then((response) => {
        // Handle success
        setMessage(response.data.message);
        console.log(response.data);
      })
      .catch((error) => {
        // Handle error
        if (error.response.data.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage("Failed to add user");
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
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="username"
              className="font-poppins text-gray-800 mb-2"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="border border-gray-300 rounded-md py-2 px-3"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="displayName"
              className="font-poppins text-gray-800 mb-2"
            >
              Display Name:
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              className="border border-gray-300 rounded-md py-2 px-3"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="password"
              className="font-poppins text-gray-800 mb-2"
            >
              Password:
            </label>
            <input
              type="text"
              id="password"
              name="password"
              className="border border-gray-300 rounded-md py-2 px-3"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="role" className="font-poppins text-gray-800 mb-2">
              Role:
            </label>
            <select
              id="role"
              name="role"
              className="border border-gray-300 rounded-md py-2 px-3"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {selectedRole === "teacher" && (
            <div className="flex flex-col mb-4">
              <label
                htmlFor="class"
                className="font-poppins text-gray-800 mb-2"
              >
                Class:
              </label>
              <select
                id="class"
                name="class"
                className="border border-gray-300 rounded-md py-2 px-3"
              >
                {classes.map((classOption) => (
                  <option key={classOption} value={classOption}>
                    {classOption}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add User
          </button>
        </form>
        <h1 className="font-poppins mt-3 text-black mx-auto text-2xl">
          {message}
        </h1>
      </div>
    </div>
  );
};

export default AddUserPage;
