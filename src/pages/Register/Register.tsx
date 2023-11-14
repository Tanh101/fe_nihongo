import React from 'react';
import './Register.scss';
import LoginNavbar from '../../components/LoginNavbar/LoginNavbar';
function Register() {
  return (
    <div className='container_div h-full'>
      <div className="register_page_background"></div>
      <LoginNavbar landingPage={false}></LoginNavbar>
      <div className='h-full'>
      <form method="POST" id="registration-form" action="" className="mb-6 px-5 pt-40">
        <input type="hidden" name="csrfmiddlewaretoken" value="{/* csrf_token */}" />
        <div className="form max-w-lg mx-auto py-11 px-12 bg-white shadow-lg rounded-3xl mt-6">
          <h1 className="text-center text-3xl font-bold mb-10">Register</h1>
          <label htmlFor="email" className="login-label mb-4 block font-bold text-gray-700">Email</label>
          <input id="email" type="email" className="focus:border-green-500 focus:outline-none block w-full rounded-2xl border py-3 mt-1 px-3" name="email" placeholder="Email" required />
          <label htmlFor="password" className="mb-4 block mt-5 font-bold text-gray-700">Password</label>
          <input type="password" id="password" className="focus:border-green-500 focus:outline-none rounded-2xl border py-3 block w-full mt-1 px-3" placeholder="Password" name="password" required />
          <label htmlFor="confirm_password" className="mb-4 block mt-5 font-bold text-gray-700">Confirm Password</label>
          <input type="password" id="confirm_password" className="focus:border-green-500 focus:outline-none rounded-2xl border py-3 block w-full mt-1 px-3" placeholder="Confirm Password" name="confirm_password" required />        
          <button type="submit" className="rounded-2xl text-xl block w-full mt-8 mb-4 py-3 px-4 bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-300 hover:to-blue-300 focus:ring-2 focus:ring-green-300 focus:ring-opacity-50 text-white font-medium">Register</button>
          <p className="register-already mt-5 text-center">
            <span>Already have an account?</span>
            <a href="/login" className="login-login-link text-blue-500">Login</a>
          </p>
        </div>
      </form>
    </div>
    </div>
  );
}

export default Register;