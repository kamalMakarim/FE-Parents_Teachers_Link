import React from "react";
import PropTypes from "prop-types";

const MessageComponent = ({ message }) => {
  return (
    <div>
      <p className="font-poppins text-sm">
        {message.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
              // Check if the part is a URL
              if (/https?:\/\/[^\s]+/.test(part)) {
                return (
                  <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {part}
                  </a>
                );
              }
              return part; // Otherwise, return as plain text
            })}
            <br />
          </React.Fragment>
        ))}
      </p>
    </div>
  );
};

MessageComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MessageComponent;
