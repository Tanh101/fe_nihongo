import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';


ReactDOM.createRoot(document.getElementById('root')!).render(
    <Router>
        <Routes>
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
        </Routes>
    </Router>
)