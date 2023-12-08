import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import LoginNavbar from "../../components/LoginNavbar/LoginNavbar";
import customAxios from "../../api/AxiosInstance";
import { Toastify } from "../../toastify/Toastify";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // Initialize the history object
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    await customAxios
      .post("/auth/login", formData)
      .then((res) => {
        if (res.status === 200) {
          Toastify.success("Login successfully");
          const token = res.data.access_token;
          localStorage.setItem("access_token", token);

          const role = res.data.user.role;

          if (role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/learn");
          }
        } else {
          Toastify.error("Incorrect username or password");
        }
      })
      .catch((err) => {
        if (err.response.data.message)
          Toastify.error(err.response.data.message);
        Toastify.error("Incorrect password");
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
            <h1 className="px-44 flex flex-row items-center justify-center text-3xl font-bold mb-10 bg-gradient-to-r from-blue-500 to-purple-500 inline-block bg-clip-text text-transparent">
              Login
            </h1>
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
              className="button2 rounded-2xl text-xl block w-full mt-8 mb-4 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:brightness-[1.2] focus:ring-2 focus:ring-green-300 focus:ring-opacity-50 text-white font-medium"
            >
              Login
            </button>
            <p className="login-already mt-5 text-center">
              <span>Don't have an account yet?</span>
              <a
                href="/register"
                className="login-login-link ml-2 bg-gradient-to-r from-blue-500 to-purple-500 inline-block bg-clip-text text-transparent font-bold hover:brightness-[1.2] font-semibold text-[17px]"
              >
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
