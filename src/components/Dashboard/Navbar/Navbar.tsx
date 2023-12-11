import React from 'react';
import user from '../../../assets/default_user.png';

const Navbar: React.FC = () => {
    return (
        <div className="flex justify-end w-full h-20 items-center border-y text-3xl font-bold">
            <div className="flex profile px-5 text-sm items-center">
                <div className="notify">
                </div>
                <img className='h-10 w-10 mr-2' src={user} alt="" />
                <span>VanTanhLy</span>
            </div>
        </div>
    );
};

export default Navbar;
