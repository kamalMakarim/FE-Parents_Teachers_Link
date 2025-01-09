import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CustomDropdown from "../../../components/CustomDropdown";
import addSVG from "../../assets/teacher/add.svg";
import { API_URL } from "../../../API_URL";
import incident from "../../assets/log/incident.svg";
import report from "../../assets/log/report.svg";
import praise from "../../assets/log/praise.svg";
import deleteSVG from "../../assets/teacher/delete.svg";
import profileSVG from "../../assets/teacher/profile.svg";
import sendSVG from "../../assets/teacher/send.svg";
import announcement from "../../assets/log/announcement.svg";
import { formatDistanceToNow } from "date-fns";
import UploadButton from "../../../components/UploadImage";
import MessageComponent from "../../../components/MessageComponent";
import ImageComponent from "../../../components/ImageComponent";
import ChatComponent from "../../../components/ChatComponent";
import { enUS, se } from "date-fns/locale";

const TeacherPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const [imageLink, setImageLink] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    getStudentClass();
  }, []);

  useEffect(() => {
    getStudentLogs(selectedStudent);
  }, [selectedStudent]);

  const getStudentClass = async () => {
    setLoading(true);
    await axios
      .get(`${API_URL}/student/getStudentClass`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        setStudents(response.data.sort((a, b) => a.name.localeCompare(b.name)));
        setSelectedStudent(response.data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getStudentLogs = async (student) => {
    setLoading(true);
    await axios
      .post(`${API_URL}/log/getLogOfStudent`, student, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        setLogs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    let student = students.find((s) => s.id === e.target.value);
    student.notification = 0;
    setSelectedStudent(student);
  };

  const formatWithoutAbout = (timestamp) => {
    const formatted = formatDistanceToNow(timestamp, {
      addSuffix: true,
      locale: enUS,
    });
    return formatted.replace("about ", "");
  };

  const handleSendChat = async () => {
    setLoading(true);
    let chatData = {
      message: message,
      studentId: selectedStudent.id,
    };

    if (imageLink) {
      chatData.image = [];
      //chatData.image = imageLink.split("/").pop();
      imageLink.forEach((link, index) => {
        chatData.image[index] = link.split("/").pop();
      });
    }
    console.log(chatData);

    await axios
      .post(`${API_URL}/chat/createChat`, chatData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        getStudentLogs(selectedStudent);
        setImageLink([]);
        setPreviewImages([]);
        setMessage("");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteLog = async (log) => {
    setLoading(true);
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this log?"
    );
    let for_personal = false;
    if (log.studentId) {
      for_personal = true;
    }
    if (confirmDelete) {
      await axios
        .delete(`${API_URL}/log/delete`, {
          params: {
            logId: log._id,
            personal: for_personal,
          },
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.message === "Log deleted") {
            window.location.reload();
          } else {
            console.log(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const logsRef = useRef(null);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }

    const images = logsRef.current?.getElementsByTagName("img");
    if (images) {
      Array.from(images).forEach((img) => {
        img.onload = () => {
          if (logsRef.current) {
            logsRef.current.scrollTop = logsRef.current.scrollHeight;
          }
        };
      });
    }
  }, [logs]);

  return (
    <div className="bg-[#00AFEF] min-h-screen flex flex-col">
      <div className="pt-10 pl-10">
        <h1 className="font-poppins text-white">Hello,</h1>
        <h1 className="font-poppins text-white font-bold">
          {localStorage.getItem("display_name")}
        </h1>
      </div>
      <div className="flex flex-col mt-5 bg-white rounded-t-2xl p-5 flex-grow">
        {!loading ? (
          <div>
            <CustomDropdown
              students={students}
              selectedStudent={selectedStudent}
              handleChange={handleChange}
            />
            <div
              ref={logsRef}
              className="mt-1 overflow-auto h-[63vh] mb-1 rounded-xl"
            >
              {logs.length > 0 &&
                logs.map((log) =>
                  log.type ? (
                    <div
                      key={log._id}
                      className="bg-gray-200 rounded-2xl flex flex-row my-3 items-center p-2 transition-all"
                    >
                      <img
                        src={
                          log.type === "Report"
                            ? report
                            : log.type === "Praise"
                            ? praise
                            : log.type === "Incident"
                            ? incident
                            : announcement
                        }
                        alt={log.type}
                        className="w-10 h-10 mb-auto"
                      />
                      <div className="flex flex-col ml-2">
                        <div className="flex flex-row items-center">
                          <p className="font-poppins font-bold text-lg">
                            {log.type}
                          </p>
                          <p className="font-poppin text-xs ml-2 font-bold text-gray-400">
                            {formatWithoutAbout(new Date(log.timestamp))}
                          </p>
                        </div>
                        {log.image &&
                          log.image.map((img, index) => (
                            <ImageComponent key={index} src={img} alt="image" />
                          ))}
                        <MessageComponent message={log.message} />
                      </div>
                      <div className="flex flex-row ml-auto">
                        <img
                          src={deleteSVG}
                          alt="Delete"
                          className="w-5 h-5 ml-2 hover:cursor-pointer"
                          onClick={() => handleDeleteLog(log)}
                        />
                      </div>
                    </div>
                  ) : (
                    <ChatComponent key={log._id} log={log} />
                  )
                )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[64vh]">
            <div className="w-16 h-16 border-4 border-[#00AFEF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {previewImages.length > 0 && (
          <div className="flex flex-row flex-wrap">
            {previewImages.map((link, index) => (
              <div key={index} className="relative group hover:cursor-pointer">
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40 m-2 rounded-md"
                  onClick={() => {
                    setImageLink(imageLink.filter((_, i) => i !== index));
                    setPreviewImages(
                      previewImages.filter((_, i) => i !== index)
                    );
                  }}
                >
                  <img
                    src={deleteSVG}
                    alt="Delete"
                    className="w-5 h-5 object-cover"
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
          </div>
        )}
        <div className="flex flex-row mt-2">
          <textarea
            className="w-full border border-gray-300 rounded-md focus:outline-none mr-2"
            placeholder="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          ></textarea>
          <UploadButton
            setImageLink={setImageLink}
            setPreviewImages={setPreviewImages}
          />
          <button
            className="ml-2 px-4 py-2 bg-[#00AFEF] text-white rounded-md hover:bg-[#017aa7]"
            onClick={handleSendChat}
          >
            <img src={sendSVG} alt="Send" className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="absolute m-10 top-0 right-0 flex flex-row">
        <img
          src={addSVG}
          alt="Add Student"
          className="w-7 hover:cursor-pointer hover:scale-105"
          onClick={() => {
            window.location.href = "/teacher/add-log";
          }}
        />
        <img
          src={profileSVG}
          alt="Profile"
          className="w-7 ml-3 hover:cursor-pointer hover:scale-105"
          onClick={() => {
            window.location.href = "/profile";
          }}
        />
      </div>
    </div>
  );
};

export default TeacherPage;
