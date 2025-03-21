import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CustomDropdown from "../../../../components/CustomDropdown";
import addSVG from "../../../assets/teacher/add.svg";
import { API_URL } from "../../../../API_URL";
import deleteSVG from "../../../assets/teacher/delete.svg";
import profileSVG from "../../../assets/teacher/profile.svg";
import sendSVG from "../../../assets/teacher/send.svg";
import UploadButton from "../../../../components/UploadImage";
import ChatComponent from "../../../../components/ChatComponent";
import LogComponent from "../../../../components/LogComponent";

const TeacherPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [imageLink, setImageLink] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  let handleScrollUpRef = useRef(false);
  const logsRef = useRef(null);

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
    getStudentLogs(new Date().getTime());
  }, [selectedStudent]);

  const getStudentClass = async () => {
    //setLoading(true);
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

  const handleScroll = async () => {
    handleScrollUpRef.current = true;
    if (logsRef.current.scrollTop === 0) {
      const oldestLog = logs.reduce((oldest, log) => {
        return !oldest || new Date(log.timestamp) < new Date(oldest.timestamp)
          ? log
          : oldest;
      }, null);
      const timestamp = oldestLog
        ? new Date(oldestLog.timestamp).getTime()
        : new Date().getTime();
      await getStudentLogs(timestamp-100);
    }
  };

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (logsRef.current) {
        logsRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [logs]);

  useEffect(() => {
    if (!handleScrollUpRef.current) {
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
    }
  }, [logs]);

  const getStudentLogs = async (timestamp) => {
    if (logs.length == 0) {
      //setLoading(true);
    }
    await axios
      .post(`${API_URL}/log/getLogOfStudent`, selectedStudent, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        params: {
          timestamp: timestamp,
        },
      })
      .then(async (response) => {
        const newLogs = response.data.data.filter(
          (log) => !logs.some((existingLog) => existingLog._id === log._id)
        );
        const sortedLogs = [...logs, ...newLogs].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        setLogs(sortedLogs);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    handleScrollUpRef.current = false;
    let student = students.find((s) => s.id === e.target.value);
    student.notification = 0;
    setSelectedStudent(student);
    setLogs([]);
  };

  const handleSendChat = async () => {
    handleScrollUpRef.current = false;
    //setLoading(true);
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
        setLogs([...logs, response.data.data]);
        setImageLink([]);
        setPreviewImages([]);
        setMessage("");
        setLoading(false);
        scrollDown();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteLog = async (log) => {
    //setLoading(true);
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
                  log.type !== "chat" ? (
                    <LogComponent
                      log={log}
                      key={log._id}
                      logs={logs}
                      setLoading={setLoading}
                      setLogs={setLogs}
                    />
                  ) : (
                    <ChatComponent
                      log={log}
                      key={log._id}
                      setLogs={setLogs}
                      logs={logs}
                    />
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
