import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../API_URL";

const AddLogPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [forAll, setForAll] = useState(true);
  const [postType, setPostType] = useState("Report");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/student/getStudentClass`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        setStudents(response.data.sort((a, b) => a.name.localeCompare(b.name)));
        setSelectedStudent(response.data[0]);
      })
      .catch((error) => {
        setMessage("An error occured");
        console.log(error);
      });
  }, []);

  const handlePostLog = () => {
    axios
      .post(
        `${API_URL}/log/add`,
        {
          type: postType,
          message: description,
          studentId: forAll ? null : selectedStudent.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setMessage(response.data.message);
        if (response.data.message == "Log created") {
          window.location.href = "/teacher";
        }
      })
      .catch((error) => {
        setMessage("An error occured");
        console.log(error);
      });
  };


  return (
    <div className="bg-[#00AFEF] flex flex-grow flex-row h-screen w-screen p-10">
      <div className="flex flex-grow items-center justify-center">
        <div className="bg-white rounded-3xl p-10 w-full max-w-[700px] flex flex-col">
          <h1 className="font-poppins text-2xl font-bold text-[#00AFEF] w-full text-center">
            Add Log
          </h1>

          <h2 className="font-poppins text-lg font-bold text-[#00AFEF] w-full mt-7">
            Post Type
          </h2>
          <div className="font-poppins flex flex-col text-lg font-medium text-[#00AFEF] w-full text-center">
            {["Report", "Praise", "Incident", "Announcement"].map((type) => (
              <React.Fragment key={type}>
                <div className="flex flex-row items-center">
                  <input
                    type="checkbox"
                    id={type.toLowerCase()}
                    name="postType"
                    value={type}
                    checked={postType === type}
                    onChange={() => setPostType(type)}
                    className="rounded border-gray-300 text-[#00AFEF] shadow-sm focus:border-[#00AFEF] focus:ring-[#00AFEF] ml-2 my-2 hover:cursor-pointer h-6 w-6"
                  />
                  <label
                    htmlFor={type.toLowerCase()}
                    className="hover:cursor-pointer ml-2"
                  >
                    {type}
                  </label>
                </div>
              </React.Fragment>
            ))}
          </div>
          <h2 className="font-poppins text-lg font-bold text-[#00AFEF] w-full mt-4">
            Who is it For
          </h2>
          <div className="font-poppins flex flex-col text-lg font-medium text-[#00AFEF] w-full text-center">
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                id="forAll"
                name="forAll"
                value="forAll"
                checked={forAll}
                onChange={() => setForAll(!forAll)}
                className="rounded border-gray-300 text-[#00AFEF] shadow-sm focus:border-[#00AFEF] focus:ring-[#00AFEF] ml-2 my-2 hover:cursor-pointer h-6 w-6"
              />
              <label htmlFor="forAll" className="hover:cursor-pointer ml-2">
                For all students in my class
              </label>
            </div>
            {!forAll && (
              <select
                onChange={(e) => {
                  setSelectedStudent(
                    students.find((student) => student.id === e.target.value)
                  );
                  console.log(selectedStudent);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                value={selectedStudent.id}
                disabled={forAll}
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <h2 className="font-poppins text-lg font-bold text-[#00AFEF] w-full mt-4">
            Descrioption
          </h2>
          <textarea
            className="font-poppins text-lg font-medium text-[#00AFEF] w-ful border border-[#00AFEF] rounded-2xl p-2 focus:outline-none"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {message && <p className="text-red-500 mx-auto">{message}</p>}
          <button
            onClick={handlePostLog}
            className="bg-[#00AFEF] text-white mx-auto py-2 mt-5 rounded-2xl font-bold font-poppins text-2xl hover:scale-105 transition-transform w-full"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddLogPage;
