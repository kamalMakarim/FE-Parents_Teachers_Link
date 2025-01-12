import React, { useState } from "react";
import { API_URL } from "../../../../API_URL";
import axios from "axios";

const AddUserPage = () => {
  const classes = ["Blue Pinter Morning" , "Blue Pinter Afternoon", "Green Motekar", "Green Wanter", "Green Maher", "Yellow Maher", "Yellow Motekar", "Yellow Wanter","Gumujeng","Someah","Rancage", "Gentur","Daria","Calakan","Singer", "Rancingeus","Jatmika", "Gumanti","Marahmay", "Rucita", "Binangkit", "Gumilang", "Sonagar", "Bidang Study TK", "Bidang Study SD"];
  const [message, setMessage] = useState("");


  const handleSubmit = async(e) => {
    setMessage("Please Wait...");
    e.preventDefault();
    // Perform the POST request here
    await axios
      .post(`${API_URL}/student/add`, {
        name: e.target.name.value,
        batch: e.target.batch.value,
        parent_username: e.target.parent_username.value,
        class_name: e.target.class_name.value,
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
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
          setMessage("Failed to add student");
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
            <label htmlFor="name" className="font-poppins text-gray-800 mb-2">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="border border-gray-300 rounded-md py-2 px-3"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="batch" className="font-poppins text-gray-800 mb-2">
              Batch:
            </label>
            <input
              type="text"
              id="batch"
              name="batch"
              className="border border-gray-300 rounded-md py-2 px-3"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="parent_username"
              className="font-poppins text-gray-800 mb-2"
            >
              Parent Username:
            </label>
            <input
              type="text"
              id="parent_username"
              name="parent_username"
              className="border border-gray-300 rounded-md py-2 px-3"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="class_name"
              className="font-poppins text-gray-800 mb-2"
            >
              Class Name:
            </label>
            <select
              id="class_name"
              name="class_name"
              className="border border-gray-300 rounded-md py-2 px-3"
            >
              {classes.map((classOption) => (
                <option key={classOption} value={classOption}>
                  {classOption}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            disabled={message === "Please Wait..."}
          >
            Add Student
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
