import React, { useState, useEffect } from "react";
import bottomLeftCircle from "../../assets/login/bottomLeftCircle.svg";
import topRightCircle from "../../assets/login/topRightCircle.svg";
import usernameLogo from "../../assets/login/username.svg";
import passwordLogo from "../../assets/login/password.svg";
import hidePasswordSvg from "../../assets/login/hide.svg";
import showPasswordSvg from "../../assets/login/unhide.svg";
import { API_URL } from "../../../API_URL.js";
import axios from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    axios
      .post(
        `${API_URL}/auth/login`,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.message === "Login successful") {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("username", response.data.data.username);
          localStorage.setItem("role", response.data.data.role);
          localStorage.setItem("display_name", response.data.data.display_name);
          setLoading(false);

          const role = response.data.data.role;
          if (role === "admin") {
            window.location.href = "/admin";
          } else if (role === "teacher") {
            window.location.href = "/teacher";
          } else if (role === "parent") {
            window.location.href = "/parent";
          } else {
            console.log("Role not found");
          }
        } else {
          console.log(response.data.message);
          setMessage(response.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setMessage("An error occured");
        setLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    const handleCookiePermission = () => {
      const cookiePermission = localStorage.getItem("cookiePermission");
      if (!cookiePermission) {
        localStorage.setItem("cookiePermission", "granted");
        console.log("Cookies have been automatically accepted.");
      }
    };

    handleCookiePermission();
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div className="md:w-[50%] w-[80%] mx-auto my-auto flex flex-col p-10">
        <img
          src="https://res.cloudinary.com/dscilmmzw/image/upload/v1720954569/LogoBhinekas_compressed_ngbhj6.png"
          alt="Logo Bhinekas"
          className="w-full mx-auto"
        />
        {message && <p className="text-red-500 mx-auto">{message}</p>}
        <div className="flex flex-row mt-8">
          <img
            src={usernameLogo}
            alt="Username"
            className="w-6 h-6 my-auto mr-3"
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-gray-100 text-black mx-auto focus:outline-none font-poppins text-xl"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <hr className="w-full mx-auto bg-black border-black border-2" />

        <div className="flex flex-row mt-3">
          <img
            src={passwordLogo}
            alt="Password"
            className="w-6 h-6 my-auto mr-3"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full bg-gray-100 text-black mx-auto focus:outline-none font-poppins text-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <img
            src={showPassword ? hidePasswordSvg : showPasswordSvg}
            alt={showPassword ? "Hide Password" : "Show Password"}
            className="w-auto h-5 mb-1 ml-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
        <hr className="w-full mx-auto bg-black border-black border-2" />
        <button
          className={`w-full bg-[#00AFEF] text-white mx-auto py-2 mt-5 rounded-2xl font-bold font-poppins text-2xl hover:scale-105 transition-transform ${
            loading ? "animate-pulse" : ""
          }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center items-center py-2">
              <div className="w-4 h-4 bg-white rounded-full mr-2 animate-bounce-0" />
              <div className="w-4 h-4 bg-white rounded-full mr-2 animate-bounce-200" />
              <div className="w-4 h-4 bg-white rounded-full animate-bounce-400" />
            </div>
          ) : (
            "Login"
          )}
        </button>
      </div>
      <img
        src={topRightCircle}
        alt="Top Right Circle"
        className="absolute top-0 right-0"
      />
      <img
        src={bottomLeftCircle}
        alt="Bottom Left Circle"
        className="absolute bottom-0 left-0"
      />
    </div>
  );
};

export default LoginPage;
