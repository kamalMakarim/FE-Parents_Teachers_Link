import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CustomDropdown from "../../../../components/CustomDropdown";
import addSVG from "../../../assets/teacher/add.svg";
import { API_URL } from "../../../../API_URL";
import incident from "../../../assets/log/incident.svg";
import report from "../../../assets/log/report.svg";
import praise from "../../../assets/log/praise.svg";
import deleteSVG from "../../../assets/teacher/delete.svg";
import profileSVG from "../../../assets/teacher/profile.svg";
import sendSVG from "../../../assets/teacher/send.svg";
import announcement from "../../../assets/log/announcement.svg";
import { formatDistanceToNow } from "date-fns";
import UploadButton from "../../../../components/UploadImage";
import { enUS, se } from "date-fns/locale";

const TeacherPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [imageLink, setImageLink] = useState("");

  useEffect(() => {
    if (localStorage.getItem("class_name") === "Bidang Study TK") {
      setClasses([
        "Blue Pinter Morning",
        "Blue Pinter Afternoon",
        "Green Motekar",
        "Green Wanter",
        "Green Maher",
        "Yellow Maher",
        "Yellow Motekar",
        "Yellow Wanter",
      ]);
      setSelectedClass("Blue Pinter Morning");
    } else if (localStorage.getItem("class_name") === "Bidang Study SD") {
      setClasses([
        "Gumujeng",
        "Someah",
        "Rancage",
        "Gentur",
        "Daria",
        "Calakan",
        "Singer",
        "Rancingeus",
        "Jatmika",
        "Gumanti",
        "Marahmay",
        "Rucita",
        "Binangkit",
        "Gumilang",
        "Sonagar",
      ]);
      setSelectedClass("Gumujeng");
    }
  }, []);

  useEffect(() => {
    getStudentClass();
  }, [selectedClass]);

  useEffect(() => {
    getStudentLogs(selectedStudent);
  }, [selectedStudent]);

  const getStudentClass = async () => {
    setLoading(true);
    await axios
      .get(`${API_URL}/student/getStudentClass`, {
        params: { class_name: selectedClass },
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
      chatData.image = imageLink.split("/").pop();
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
        setImageLink("");
        setMessage("");
        setLoading(false);
        getStudentLogs();
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
            <div className="mb-4">
              <select
                id="classSelect"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="block appearance-none w-full bg-white border hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                {classes.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>
            <CustomDropdown
              students={students}
              selectedStudent={selectedStudent}
              handleChange={handleChange}
            />
            <div
              ref={logsRef}
              className="mt-1 overflow-auto h-[55vh] mb-1 rounded-xl"
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
                        {log.image && (
                          <img
                            src={`${log.image}`}
                            alt="image"
                            className="w-max rounded-lg my-2 max-h-[50vh]"
                            loading="lazy"
                          />
                        )}
                        <p className="font-poppins text-sm">{log.message}</p>
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
                    <div
                      key={log._id}
                      className={`rounded-2xl flex flex-row my-3 items-center p-2 max-w-[75vw] ${
                        localStorage.getItem("display_name") === log.writter
                          ? "ml-auto bg-green-200"
                          : "mr-auto bg-gray-200"
                      }`}
                      style={{ width: "fit-content", maxWidth: "75vw" }}
                    >
                      <div className={`flex flex-col`}>
                        <div className="flex flex-row items-center">
                          <p className="font-poppins font-semibold text-xs md:text-base">
                            {log.writter}
                          </p>
                          <p className="font-poppin text-xs ml-2 font-bold text-gray-400">
                            {formatWithoutAbout(new Date(log.timestamp))}
                          </p>
                        </div>
                        {log.image && (
                          <img
                            src={`${log.image}`}
                            alt="image"
                            className="w-max rounded-lg my-2 max-h-[50vh]"
                            loading="lazy"
                          />
                        )}
                        <p className="font-poppins text-sm">{log.message}</p>
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[64vh]">
            <div className="w-16 h-16 border-4 border-[#00AFEF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {imageLink && (
          <img
            src={imageLink}
            alt="Preview"
            className="w-max h-[10vh] object-contain rounded-md shadow-md"
            loading="lazy"
          />
        )}
        <div className="flex flex-row mt-2">
          <textarea
            className="w-full border border-gray-300 rounded-md focus:outline-none mr-2"
            placeholder="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          ></textarea>
          <UploadButton setImageLink={setImageLink} />
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
            window.location.href = "/teacher/bidang-study/add-log";
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