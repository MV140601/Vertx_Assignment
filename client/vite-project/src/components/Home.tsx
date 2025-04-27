 import Leftsidebar from './Leftsidebar'
import Rightsidebar from './Rightsidebar'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div className="flex justify-between w-full">
  <div className="w-[20%]">
    <Leftsidebar />
  </div>

  <div className="w-[60%]">
    <Outlet />
  </div>

  <div className="w-[20%]">
    <Rightsidebar />
  </div>
</div>

  )
}

export default Home