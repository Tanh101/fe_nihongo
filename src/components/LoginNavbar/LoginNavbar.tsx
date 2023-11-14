import React from 'react'
import { useNavigate} from 'react-router-dom';
import Logo from '../../assets/shibalogo.jpg'
import './LoginNavbar.scss'

interface Props {
  landingPage: boolean;
}

const LoginNavbar: React.FC<Props> = (props) => {
  const navigate = useNavigate(); // Initialize the history object
  const handleLoginClick = () => {
    navigate('/login');
  };
  const handleRegisterClick = () => {
    navigate('/register');
  }
  return (
    <div className='login_navbar'>
        <div className='login_navbar_logo_container'>
            <img src={Logo} alt='' className="logo_img" />
            <div className='login_nav_bar_title'>
                <span>Shiba Sensei</span>
            </div>
        </div>
        {props.landingPage ? <div></div> : <div className='login_navbar_buttons_container'>
            <button className='login_button' onClick={handleLoginClick}>Log In</button>
            <button className='register_button' onClick={handleRegisterClick}>Register</button>
        </div>}
        
    </div>
  )
}

export default LoginNavbar
