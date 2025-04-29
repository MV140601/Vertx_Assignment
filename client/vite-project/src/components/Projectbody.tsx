import React,{useEffect} from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home';
import Login from './Login';
 import AllPosts from './AllPosts';
import Savedposts from './savedposts';
import Reportedposts from './reportedposts';
import Notifications from './Notifications';
import Profile from './Profile';
import AdminLogin from './AdminLogin';
import {useSelector,useDispatch} from "react-redux";
import { RootState } from "../redux/store";  
import Alluserdetails from './Alluserdetails';
import socket from '../socketconnection/socket';
import toast from 'react-hot-toast';
const ProjectBody = () => {
   const { user } = useSelector((state: RootState) => state.user);
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children:[
        {
            path: "",  
          element: <AllPosts />,
        },
        {
          path: "/allusers",  
        element: <Alluserdetails />,
      },
        {
          path: "/savedposts",
          element: <Savedposts />,
        },{
          path:"/reportedposts",
          element:<Reportedposts/>
        },
        {
          path:"/profile",
          element:<Profile/>
        }
      ],
    },
    {
      path: "/login",
      element: <Login />
    }
    ,
    {
      path: "/AdminLogin",
      element: <AdminLogin />
    }
  ]);

  useEffect(() => {
    if (user?._id) {
      socket.emit('register', user._id);
  
      
      if (user.Role === 'Admin') {
        socket.on('admin-notification', (data) => {
          toast.success(`🔔 Admin Alert: ${data.message}`);
        });
      } else {
        
        socket.on('reward-updated', (data) => {
          toast.success(`🎉 ${data.message}`);
        });
      }
    }
  
    return () => {
      socket.off('admin-notification');
      socket.off('reward-updated');
    };
  }, [user]);
  return (
    <div>
      <RouterProvider router={appRouter} 
      />
    </div>
  )
}

export default ProjectBody
