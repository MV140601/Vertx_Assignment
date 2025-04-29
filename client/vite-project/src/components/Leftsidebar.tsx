import React from 'react';
import { CiHome } from "react-icons/ci";
import { CiHashtag } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { Link,useNavigate } from 'react-router-dom';
import {useSelector,useDispatch} from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { RootState } from "../redux/store";  
const LeftNavigation = () => {
    const { user } = useSelector((state: RootState) => state.user);
  console.log(user);
    return (
        <div className="w-[20%] bg-gray-300  h-[60%]    ">
        <div className='w-full'>
        <div className="flex align-middle mt-3 w-full h-full justify-evenly ">
                    {/* <img src={logo} alt="ECHONET LOGO" className="w-[50px] h-[50px] ml-5 pt-2" /> */}
                    {user?.Role=="User" &&   <h1 className="text-3xl mx-auto font-extrabold  text-blue-400 cursor-pointer font-Italianno hover:drop-shadow-md italic px-4" >VertX Creator</h1>}
                    {user?.Role=="Admin" &&   <h1 className="text-3xl mx-auto font-extrabold  text-blue-400 cursor-pointer font-Italianno hover:drop-shadow-md italic px-4" >VertX Admin Panel</h1>}

                </div>
            <div className='my-4 flex flex-col justify-evenly'>
                <Link to="/" className='flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                    <div>
                        <CiHome size="24px" />
                    </div>
                    <h1 className='font-bold text-lg ml-2'>Home</h1>
                </Link>
                <Link to="/notifications" className='flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                    <div>
                        <CiHome size="24px" />
                    </div>
                    <h1 className='font-bold text-lg ml-2'>Notifications</h1>
                </Link>
                {user?.Role=="Admin" &&
                <Link to="/allusers" className='flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                    <div>
                        <CiHome size="24px" />
                    </div>
                    <h1 className='font-bold text-lg ml-2'>All Users</h1>
                </Link>
}
               {user?.Role=="User" &&
                <Link to="/savedposts" className='flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                    <div>
                        <CiHome size="24px" />
                    </div>
                    <h1 className='font-bold text-lg ml-2'>Saved Posts</h1>
                </Link>  } <Link to="/reportedposts" className='flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                    <div>
                        <CiHome size="24px" />
                    </div>
                    <h1 className='font-bold text-lg ml-2'>Reported Posts</h1>
                </Link>   {user?.Role==="User"&& <Link to="/profile" className='flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                    <div>
                        <CiHome size="24px" />
                    </div>
                    <h1 className='font-bold text-lg ml-2'>Profile</h1>
                </Link>}
                <Link to="/notifications" className='flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                    <div>
                        <CiHome size="24px" />
                    </div>
                    <h1 className='font-bold text-lg ml-2'>Logout</h1>
                </Link>
             </div>
        </div>
    </div>
)
};

export default LeftNavigation;
