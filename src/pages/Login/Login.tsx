import React from 'react'
import './Login.scss'

function Login() {
  return (
    <div>
      <header className="header bg-white shadow">
        <nav className="mx-auto flex max-w-full items-center justify-between px-10 py-4">
          <div>
            <header className="header bg-white shadow">
              <nav className="mx-auto flex max-w-full items-center justify-between px-10 py-4">
                <a href="/" className="nav_logo flex items-center text-xl font-semibold text-black">
                 <div className="logo">D</div>
                  <p>DokiDoki</p>
                </a>
              </nav>
            </header>
            </div>
        </nav>
      </header>

            <form method="POST" action="" className="mb-6 pt-24 px-10">
              <input type="hidden" name="csrfmiddlewaretoken" value="csrf_token" />
              <div className="form max-w-lg mx-auto py-12 px-12 bg-white shadow-lg rounded-3xl">
                <h1 className="text-center text-3xl font-bold mb-10">Login</h1>
                <label htmlFor="email" className="login-label mb-4 block font-bold text-gray-700">Email</label>
                <input id="email" type="email" className="focus:border-green-500 focus:outline-none block w-full rounded-2xl border py-3 mt-1 px-3" name="email" placeholder="Email" required />
                <label htmlFor="password" className="mb-4 block mt-5 font-bold text-gray-700">Password</label>
                <input type="password" id="password" className="focus:border-green-500 focus:outline-none rounded-2xl border py-3 block w-full mt-1 px-3" placeholder="Password" name="password" required />
                <div className="flex items-center mt-5">
                  <input className="focus:border-green-500 focus:outline-none form-check-input h-4 w-4 text-green-500" type="checkbox" name="remember" id="remember" />
                  <label className="form-check-label ml-2 text-sm text-gray-700" htmlFor="remember">Remember Me</label>
                </div>
                <button type="submit" className="rounded-2xl text-xl block w-full mt-8 mb-4 py-3 px-4 bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-300 hover:to-blue-300 focus:ring-2 focus:ring-green-300 focus:ring-opacity-50 text-white font-medium">Login</button>
                <p className="login-already mt-5 text-center">
                  <span>Don't have an account yet?</span>
                  <a href="/register" className="login-login-link text-blue-500">Register now</a>
                </p>
              </div>
            </form>
    </div>
   )
  }
export default Login

