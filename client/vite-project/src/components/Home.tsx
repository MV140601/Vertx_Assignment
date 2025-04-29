import { Outlet } from "react-router-dom";
import LeftNavigation from "../components/Leftsidebar";

const HomeLayout = () => {
  return (
    <div className="flex  w-screen h-screen mx-auto border-2">
    <LeftNavigation/>
    <Outlet/>
  </div>
  );
};

export default HomeLayout;
