import React, { useState, useEffect } from "react";
import bottomLeftCircle from "../../assets/login/bottomLeftCircle.svg";
import topRightCircle from "../../assets/login/topRightCircle.svg";
import LogoBhinekas from "../../assets/LogoBhinekas.png";
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

  const handleSubmit = (e) => {
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
          localStorage.setItem("username", response.data.data.username);
          localStorage.setItem("role", response.data.data.role);
          localStorage.setItem("display_name", response.data.data.display_name);

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
        }
      })
      .catch((error) => {
        setMessage("An error occured");
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
    <div className="w-full h-full flex justify-center items-center">
      <div className="md:w-[50%] w-[80%] mx-auto my-auto flex flex-col p-10">
        <img
          src={LogoBhinekas}
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
            className="w-full bg-white text-black mx-auto focus:outline-none font-poppins text-xl"
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
            className="w-full bg-white text-black mx-auto focus:outline-none font-poppins text-xl"
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
          className="w-full bg-[#00AFEF] text-white mx-auto py-2 mt-5 rounded-2xl font-bold font-poppins text-2xl hover:scale-105 transition-transform"
          onClick={handleSubmit}
        >
          Login
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
