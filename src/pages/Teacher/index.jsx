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
import announcement from "../../assets/log/announcement.svg";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

const TeacherPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/student/getStudentClass`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setStudents(response.data.sort((a, b) => a.name.localeCompare(b.name)));
        setSelectedStudent(response.data[0]);
        getStudentLogs();
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getStudentClass();
    getStudentLogs();
    setLoading(false);
  }, [selectedStudent]);

  const getStudentLogs = async () => {
    setLoading(true);
    axios
      .post(`${API_URL}/log/getLogOfStudent`, selectedStudent, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setLogs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getStudentClass = async () => {
    setLoading(true);
    axios
      .get(`${API_URL}/student/getStudentClass`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const student = students.find((s) => s.id === e.target.value);
    setSelectedStudent(student);
  };

  const formatWithoutAbout = (timestamp) => {
    const formatted = formatDistanceToNow(
      new Date(new Date(timestamp).toLocaleString()),
      { addSuffix: true, locale: enUS }
    );
    return formatted.replace("about ", "");
  };

  const handleSendChat = () => {
    setLoading(true);
    axios
      .post(
        `${API_URL}/chat/createChat`,
        {
          message: message,
          studentId: selectedStudent.id,
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
        if (response.data.message === "Chat created") {
          window.location.reload();
        } else {
          console.log(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteLog = (log) => {
    setLoading(true);
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this log?"
    );
    let for_personal = false;
    if (log.studentId) {
      for_personal = true;
    }
    if (confirmDelete) {
      axios
        .delete(`${API_URL}/log/delete`, {
          params: {
            logId: log._id,
            personal: for_personal,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
  }, [logs]);

  return (
    <div className="bg-[#00AFEF] min-h-screen flex flex-col">
      <div className="pt-10 pl-10">
        <h1 className="font-poppins text-white">Hello,</h1>
        <h1 className="font-poppins text-white font-bold">
          {localStorage.getItem("display_name")}
        </h1>
      </div>
      <div className="flex flex-col mt-5 bg-white rounded-t-2xl p-10 flex-grow">
        {loading ? (
          <div>
            <CustomDropdown
              students={students}
              selectedStudent={selectedStudent}
              handleChange={handleChange}
            />
            <div
              ref={logsRef}
              className="mt-1 overflow-auto h-[60vh] mb-1 rounded-xl"
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
                        className="w-10 h-10"
                      />
                      <div className="flex flex-col ml-2">
                        <div className="flex flex-row items-center">
                          <p className="font-poppins font-bold text-lg">
                            {log.type}
                          </p>
                          <p className="font-poppin text-xs ml-2 font-bold text-gray-400">
                            {formatWithoutAbout(
                              new Date(
                                new Date(log.timestamp).toLocaleString()
                              ),
                              { locale: enUS }
                            )}
                          </p>
                        </div>
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
                      className={`rounded-2xl flex flex-row my-3 items-center p-2 w-[55vw] ${
                        localStorage.getItem("display_name") === log.writter
                          ? "ml-auto bg-green-200"
                          : "mr-auto bg-gray-200"
                      }`}
                    >
                      <div className={`flex flex-col`}>
                        <div className="flex flex-row items-center">
                          <p className="font-poppins font-semibold text-xs md:text-base">
                            {log.writter}
                          </p>
                          <p className="font-poppin text-xs ml-2 font-bold text-gray-400">
                            {formatWithoutAbout(
                              new Date(
                                new Date(log.timestamp).toLocaleString()
                              ),
                              { locale: enUS }
                            )}
                          </p>
                        </div>
                        <p className="font-poppins text-sm">{log.message}</p>
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div className="flex flex-row mt-2">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            placeholder="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button
            className="ml-2 px-4 py-2 bg-[#00AFEF] text-white rounded-md hover:bg-[#017aa7]"
            onClick={handleSendChat}
          >
            Send
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
