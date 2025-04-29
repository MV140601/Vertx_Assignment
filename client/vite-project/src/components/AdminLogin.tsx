import React, { useState } from 'react'
import toast from "react-hot-toast";
import { USER_API_END_POINT } from '../utils/constant';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { AppDispatch } from '../redux/store';
const AdminLogin = () => {
  
  const [isLogin, setIsLogin] = useState(true);
  const [UserName, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
   const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

  const submitHandler  = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Processing...");
    if (isLogin) {
 
      try {
        const res = await axios.post(`${USER_API_END_POINT}/login`, { Email, Password }, {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        }); 
        // dispatch(getUser(res?.data?.user));
        console.log(res);
        if(res.data.success){
          navigate("/");    
         console.log(res.data.message); dispatch(setUser(res.data.user));
          toast.success(res.data.message);
        }
      } catch (error:any) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    } else {
      // signup
      try {
        const res = await axios.post(`${USER_API_END_POINT}/register`, {  UserName, Email, Password,RoleId:"Admin" }, {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        }); 
        if(res.data.success){
          setIsLogin(true);
          toast.success(res.data.message);
        }
      } catch (error:any) {
        toast.success(error.response.data.message);
        console.log(error);
      }
    }
  }

const loginsignuphandler=(ev:React.MouseEvent<HTMLButtonElement>)=>{
  ev.preventDefault();
  setIsLogin(!isLogin);
}

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className='flex items-center justify-evenly w-[80%]'>
        {/* <div><img src={logo} width={"300px"} alt="" /></div> */}
        <div className='w-[50%]'>
          <div className='my-5'>
          <h1 className=' font-bold text-5xl font-FacultyGlyphic'>Welcome to Admin Panel</h1>
          </div>
          <h1 className='mt-4 mb-2 text-3xl   font-semibold font-serif '>{isLogin?"Login":"Create Account"} </h1>
          <form className='flex flex-col w-[50%] space-y-2' onSubmit={submitHandler}>
            {
              !isLogin && (<>
              
               <input type="text" value={UserName} onChange={(ev)=>setUsername(ev.target.value)} placeholder='UserName' className=' font-semibold outline-blue-300 border border-gray-300 px-3 py-2 rounded-full' />
              </>)
            }
            <input type="email" value={Email} onChange={(ev)=>setEmail(ev.target.value)} placeholder='Email' className=' font-semibold outline-blue-300 border border-gray-300 px-3 py-2 rounded-full' />
            <input type="password" value={Password} onChange={(ev)=>setPassword(ev.target.value)} placeholder='Password' className=' font-semibold outline-blue-300 border border-gray-300 px-3 py-2 rounded-full'  />
          <button className='bg-indigo-400 text-lg border-none py-2 my-4 rounded-full text-white font-bold hover:bg-indigo-500'>{!isLogin? "Register":"Login"}</button>
          <Link to="/login">Are You an Creator?<span className='text-blue-600'>Click here to login as a Creator</span></Link>
         <h1>{isLogin? "Do not have an Account?":"Already have an Account"} <button className='text-indigo-600 font-semibold ' onClick={loginsignuphandler}>{isLogin? "Register":"Login"}</button> </h1>
          
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin