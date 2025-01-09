import React, { useState } from "react";
import deleteSVG from "../src/assets/teacher/delete.svg";
import { formatDistanceToNow } from "date-fns";
import { enUS, se } from "date-fns/locale";
import MessageComponent from "./MessageComponent";
import ImageComponent from "./ImageComponent";


const ChatComponent = ({ log }) => {
  const formatWithoutAbout = (timestamp) => {
    const formatted = formatDistanceToNow(timestamp, {
      addSuffix: true,
      locale: enUS,
    });
    return formatted.replace("about ", "");
  };

  return (
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
        <div className="flex flex-row items-center">
          <img src={deleteSVG} alt={log.type} className="w-5 h-5 my-auto" />
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
