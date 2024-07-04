import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../../API_URL";
import deleteSVG from "../../../assets/teacher/delete.svg";
import editSVG from "../../../assets/teacher/edit.svg";

const ManageStudentPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedStudent, setSelectedStudent] = useState({});

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/student/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setStudents(response.data);
        setFilteredStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    setFilteredStudents(
      students.filter((student) =>
        student.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleDelete = (studentToDelete) => {
    setLoading(true);
    axios
      .delete(`${API_URL}/student/delete/${studentToDelete.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setStudents(
          students.filter((student) => student.name !== studentToDelete.name)
        );
        setFilteredStudents(
          filteredStudents.filter(
            (student) => student.name !== studentToDelete.name
          )
        );
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleSaveEdit = () => {
    axios
      .put(
        `${API_URL}/student/update`,
        {
          id: selectedStudent.id,
          name: selectedStudent.name,
          batch: selectedStudent.batch,
          parent_username: selectedStudent.parent_username,
          class_name: selectedStudent.class_name,
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
        if (response.data.message === "Student updated") {
          setShowEditPopup(false);
        } else {
          setMessage("Failed to update student");
        }
      })
      .catch((error) => {
        if (error.response.data.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage("Failed to update student");
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
            filteredStudents.map((student) => (
              <div
                key={student.name}
                className="mb-4 bg-gray-200 flex flex-row rounded-lg p-2 items-center"
              >
                <div className="flex flex-row">
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold">{student.name}</h2>
                    <p className="text-gray-500">Class: {student.class_name}</p>
                  </div>
                </div>
                <div className="flex justify-end ml-auto">
                  <img
                    src={editSVG}
                    alt="Edit"
                    className="w-6 h-6 cursor-pointer mr-2"
                    onClick={() => {
                      setShowEditPopup(true);
                      setSelectedStudent(student);
                    }}
                  />
                  <img
                    src={deleteSVG}
                    alt="Delete"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => {
                      handleDelete(student);
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
            <h2 className="text-lg font-semibold mb-2">Edit Student</h2>
            <label
              htmlFor="name"
              className="font-poppins text-gray-800 text-xs"
            >
              Name:
            </label>
            <input
              type="text"
              placeholder="Name"
              className="border border-gray-300 rounded-md py-2 px-3"
              value={selectedStudent.name}
              onChange={(e) =>
                setSelectedStudent({ ...selectedStudent, name: e.target.value })
              }
            />
            <label
              htmlFor="batch"
              className="font-poppins text-gray-800 text-xs"
            >
              Batch:
            </label>
            <input
              type="text"
              placeholder="Batch"
              className="border border-gray-300 rounded-md py-2 px-3"
              value={selectedStudent.batch}
              onChange={(e) =>
                setSelectedStudent({ ...selectedStudent, batch: e.target.value })
              }
            />
            <label
              htmlFor="parent_username"
              className="font-poppins text-gray-800 text-xs"
            >
              Parent Username:
            </label>
            <input
              type="text"
              placeholder="Parent Username"
              className="border border-gray-300 rounded-md py-2 px-3"
              value={selectedStudent.parent_username}
              onChange={(e) =>
                setSelectedStudent({
                  ...selectedStudent,
                  parent_username: e.target.value,
                })
              }
            />
            <label
              htmlFor="class_name"
              className="font-poppins text-gray-800 text-xs"
            >
              Class Name:
            </label>
            <select
              id="class_name"
              name="class_name"
              className="border border-gray-300 rounded-md py-2 px-3"
              value={selectedStudent.class_name}
              onChange={(e) =>
                setSelectedStudent({
                  ...selectedStudent,
                  class_name: e.target.value,
                })
              }
            >
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
              <option value="Yellow">Yellow</option>
            </select>
            <button
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md"
              onClick={() => handleSaveEdit()}
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

export default ManageStudentPage;
