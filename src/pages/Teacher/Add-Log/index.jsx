import React, { useEffect, useState } from "react";
import axios from "axios";
import UploadButton from "../../../../components/UploadImage";
import Trash from "../../../assets/teacher/delete.svg";
import { API_URL } from "../../../../API_URL";

const AddLogPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [forAll, setForAll] = useState(true);
  const [postType, setPostType] = useState("Report");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [imageLink, setImageLink] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

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

  const handlePostLog = async () => {
    let logData = {
      type: postType,
      message: description,
      studentId: forAll ? null : selectedStudent.id,
    };
    console.log(imageLink);
    if (imageLink) {
      logData.image = [];
      imageLink.forEach((link, index) => {
        logData.image[index] = link.split("/").pop();
      });
    }

    await axios
      .post(`${API_URL}/log/add`, logData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
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
    <div className="bg-[#00AFEF] flex flex-grow flex-row h-full w-full py-10">
      <div className="flex flex-grow items-center justify-center">
        <div className="bg-white rounded-3xl p-10 w-full max-w-[700px] flex flex-col">
          <h1 className="font-poppins text-2xl font-bold text-[#00AFEF] w-full text-center">
            Add Log
          </h1>

          <h2 className="font-poppins text-lg font-bold text-[#00AFEF] w-full mt-7">
            Post Type
          </h2>
          <div className="font-poppins grid grid-cols-2 text-lg font-medium text-[#00AFEF] w-full text-center">
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
            Description
          </h2>
          <textarea
            className="font-poppins text-lg font-medium text-[#00AFEF] w-full border border-[#00AFEF] rounded-2xl p-2 focus:outline-none mb-2"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {previewImages.length > 0 ? (
            <div className="flex flex-row flex-wrap">
              {previewImages.map((link, index) => (
                <div key={index} className="relative group hover:cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40 m-2 rounded-md">
                    <img
                      src={Trash}
                      alt="Delete"
                      className="w-5 h-5 object-cover"
                      onClick={() => {
                        setImageLink(imageLink.filter((_, i) => i !== index));
                        setPreviewImages(previewImages.filter((_, i) => i !== index));
                      }}
                    />
                  </div>
                  <img
                    src={link}
                    alt={`Preview ${index}`}
                    className="w-max h-[10vh] object-contain rounded-md shadow-md m-2 hover:cursor-pointer hover:opacity-80"
                    loading="lazy"
                  />
                </div>
              ))}
              <UploadButton setImageLink={setImageLink} setPreviewImages={setPreviewImages}/>
            </div>
          ) : (
            <UploadButton setImageLink={setImageLink} setPreviewImages={setPreviewImages} />
          )}
          <button
            onClick={handlePostLog}
            className="bg-[#00AFEF] text-white mx-auto py-2 mt-5 rounded-2xl font-bold font-poppins text-2xl hover:scale-105 transition-transform flex-1 w-full"
          >
            Post
          </button>
          {message && <p className="text-red-500 mx-auto">{message}</p>}
        </div>
      </div>
    </div>
  );
};
export default AddLogPage;
