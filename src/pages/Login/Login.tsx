import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.scss";
import LoginNavbar from "../../components/LoginNavbar/LoginNavbar";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // Initialize the history object

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    console.log(formData.get("email"));
    await axios
      .post("https://mazii.vantanhly.io.vn/api/auth/login", formData)
      .then((res) => {
        if (res.status === 200) {
          navigate("/learn");
        } else {
          toast.error("Incorrect username or password", {
            position: "top-center",
            autoClose: 3000, // Optional: Close the message after 3 seconds
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="main_container">
      <LoginNavbar landingPage={false}></LoginNavbar>
      <div className="login_page_background"></div>
      <div className="form_container h-full">
        <form
          method="POST"
          onSubmit={handleSubmit}
          className="mb-6 pt-44 px-10"
        >
          <input type="hidden" name="csrf-token" value="csrf_token" />
          <div className="form max-w-lg mx-auto py-12 px-12 bg-white shadow-lg rounded-3xl">
            <h1 className="text-center text-3xl font-bold mb-10">Login</h1>
            <label
              htmlFor="email"
              className="login-label mb-4 block font-bold text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="focus:border-green-500 focus:outline-none block w-full rounded-2xl border py-3 mt-1 px-3"
              name="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="password"
              className="mb-4 block mt-5 font-bold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="focus:border-green-500 focus:outline-none rounded-2xl border py-3 block w-full mt-1 px-3"
              placeholder="Password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center mt-5">
              <input
                className="focus:border-green-500 focus:outline-none form-check-input h-4 w-4 text-green-500"
                type="checkbox"
                name="remember"
                id="remember"
              />
              <label
                className="form-check-label ml-2 text-sm text-gray-700"
                htmlFor="remember"
              >
                Remember Me
              </label>
            </div>
            <button
              type="submit"
              className="rounded-2xl text-xl block w-full mt-8 mb-4 py-3 px-4 bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-300 hover:to-blue-300 focus:ring-2 focus:ring-green-300 focus:ring-opacity-50 text-white font-medium"
            >
              Login
            </button>
            <p className="login-already mt-5 text-center">
              <span>Don't have an account yet?</span>
              <a href="/register" className="login-login-link text-blue-500">
                Register now
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
