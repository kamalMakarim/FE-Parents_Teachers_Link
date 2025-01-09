import React, { useState } from "react";
import deleteSVG from "../src/assets/teacher/delete.svg";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import MessageComponent from "./MessageComponent";
import ImageComponent from "./ImageComponent";
import axios from "axios";
import { API_URL } from "../API_URL";

const ChatComponent = ({ log, setLogs, logs }) => {
  const formatWithoutAbout = (timestamp) => {
    const formatted = formatDistanceToNow(timestamp, {
      addSuffix: true,
      locale: enUS,
    });
    return formatted.replace("about ", "");
  };

  const handleDeleteChat = async () => {
    if (!window.confirm("Are you sure you want to delete this chat?")) {
      return;
    }
    await axios
      .delete(`${API_URL}/chat/deleteChat`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        params: {
          chatId: log._id,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.message === "Chat deleted") {
          setLogs(logs.filter((i) => i._id !== log._id));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      key={log._id}
      className={"rounded-2xl flex flex-row items-center p-2 max-w-[75vw]"}
      style={{
        width: "fit-content",
        maxWidth: "75vw",
        background: `${
          localStorage.getItem("display_name") === log.writter
            ? "#bbf7d0"
            : "#e5e7eb"
        }`,
        marginLeft: `${
          localStorage.getItem("display_name") === log.writter ? "auto" : "0"
        }`,
        marginRight: `${
          localStorage.getItem("display_name") === log.writter ? "0" : "auto"
        }`,
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
      }}
    >
      <div className={`flex flex-col`}>
        <div className="flex flex-row items-center">
          <p className="font-poppins font-semibold text-xs md:text-base">
            {log.writter}
          </p>
          <p className="font-poppin text-xs ml-2 font-bold text-gray-400">
            {formatWithoutAbout(new Date(log.timestamp))}
          </p>
          <img
            src={deleteSVG}
            alt={log.type}
            className="w-5 h-5 my-auto hover:cursor-pointer ml-2"
            onClick={handleDeleteChat}
            style={
              localStorage.getItem("display_name") === log.writter
                ? {}
                : { display: "none" }
            }
          />
        </div>
        <div className="flex flex-row items-center">
          <div className="flex flex-col">
            {log.image &&
              log.image.map((img, index) => (
                <ImageComponent key={index} src={img} alt="image" />
              ))}
            <div className="flex flex-row items-center"></div>

            <MessageComponent message={log.message} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
