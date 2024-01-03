import "./Register.scss";
import LoginNavbar from "../../components/LoginNavbar/LoginNavbar";
import customAxios from "../../api/AxiosInstance";
import { Toastify } from "../../toastify/Toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate(); // Initialize the history object
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Toastify.error("Password and confirm password doesn't match");
      return;
    }
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("password_confirmation", confirmPassword);
    await customAxios
      .post("/auth/register", formData)
      .then((res) => {
        if (res.status === 200) {
          Toastify.success("Create account successfully");
          navigate("/login");
        } else {
          Toastify.error("Incorrect email or password");
        }
      })
      .catch((err) => {
        if (err.response.data.message)
          Toastify.error(err.response.data.message);
        Toastify.error("Incorrect password");
      });
  };
  return (
    <div className="container_div h-full">
      <div className="register_page_background"></div>
      <LoginNavbar landingPage={false}></LoginNavbar>
      <div className="h-full">
        <form
          method="POST"
          id="registration-form"
          onSubmit={handleSubmit}
          className="mb-6 px-5 pt-40"
        >
          <input
            type="hidden"
            name="csrfmiddlewaretoken"
            value="{/* csrf_token */}"
          />
          <div className="form max-w-lg max-h-[500px] mx-auto py-4 px-12 bg-white shadow-lg rounded-3xl mt-6 border-2 boder-solid border-red-500">
            <h1 className="px-44 flex flex-row items-center justify-center text-3xl font-bold mb-5 bg-gradient-to-r from-blue-500 to-purple-500 inline-block bg-clip-text text-transparent">
              Register
            </h1>
            <label
              htmlFor="email"
              className="login-label mb-2 block font-bold text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              className="focus:border-green-500 focus:outline-none block w-full rounded-2xl border py-3 mt-1 px-3 h-[40px]"
              name="name"
              placeholder="Name"
              required
              onChange={(e) => setName(e.target.value)}
            />
            <label
              htmlFor="email"
              className="login-label mt-2 mb-2 block font-bold text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="focus:border-green-500 focus:outline-none block w-full rounded-2xl border py-3 mt-1 px-3 h-[40px]"
              name="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="password"
              className="mb-2 block mt-2 font-bold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="focus:border-green-500 focus:outline-none rounded-2xl border py-3 block w-full mt-1 px-3 h-[40px]"
              placeholder="Password"
              name="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor="confirm_password"
              className="mb-2 block mt-2 font-bold text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password"
              className="focus:border-green-500 focus:outline-none rounded-2xl border py-3 block w-full mt-1 px-3 h-[40px] mb-5"
              placeholder="Confirm Password"
              name="confirm_password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              className="button2 rounded-2xl text-xl block w-full h-[40px] px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:brightness-[1.2] focus:ring-2 focus:ring-green-300 focus:ring-opacity-50 text-white font-medium"
            >
              Register
            </button>
            <p className="register-already mt-5 text-center">
              <span>Already have an account?</span>
              <a
                href="/login"
                className="login-login-link ml-2 bg-gradient-to-r from-blue-500 to-purple-500 inline-block bg-clip-text text-transparent font-bold hover:brightness-[1.2] font-semibold text-[17px]"
              >
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
