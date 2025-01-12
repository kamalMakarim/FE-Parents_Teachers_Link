import React from "react";
import announcement from "../src/assets/log/announcement.svg";
import incident from "../src/assets/log/incident.svg";
import praise from "../src/assets/log/praise.svg";
import report from "../src/assets/log/report.svg";
import ImageComponent from "./ImageComponent";
import MessageComponent from "./MessageComponent";
import { formatDistanceToNow } from "date-fns";
import deleteSVG from "../src/assets/teacher/delete.svg";
import axios from "axios";  
import { API_URL } from "../API_URL";
import { enUS } from "date-fns/locale";

const LogComponent = ({ log , logs, setLoading, setLogs}) => {
  const formatWithoutAbout = (timestamp) => {
    const formatted = formatDistanceToNow(timestamp, {
      addSuffix: true,
      locale: enUS,
    });
    return formatted.replace("about ", "");
  };

  const handleDeleteLog = async () => {
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
            setLogs(logs.filter((i) => i._id !== log._id));
            setLoading(false);
          } else {
            console.log(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div
      key={log._id}
      className="bg-gray-200 rounded-2xl flex flex-row items-center p-2 transition-all"
      style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
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
        style={{ marginBottom: "auto" }}
      />
      <div className="flex flex-col ml-2">
        <div className="flex flex-row items-center">
          <p className="font-poppins font-bold text-lg">{log.type}</p>
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
      <img
        src={deleteSVG}
        alt="Delete"
        className="w-5 h-5 hover:cursor-pointer ml-auto"
        onClick={() => handleDeleteLog()}
        style={
          localStorage.getItem("role") == "teacher"
            ? {}
            : { display: "none" }
        }
      />
    </div>
  );
};

export default LogComponent;
