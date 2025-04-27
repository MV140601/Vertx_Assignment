import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home';
import Login from './Login';
 import Feed from './Feed';


const ProjectBody = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children:[
        {
            path: "",  
          element: <Feed />,
        }
      ],
    },
    {
      path: "/login",
      element: <Login />
    }

  ]);

  return (
    <div>
      <RouterProvider router={appRouter} 
      />
    </div>
  )
}

export default ProjectBody
