 import { CiHome } from "react-icons/ci";
 import { GoHash } from "react-icons/go";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
  
const Leftsidebar = () => { 
    

    return (
        <div className="w-[20%]">
            <div>
                 <div className="flex align-middle mt-3 ">
                     <h1 className="text-7xl mx-auto font-extrabold bg-white text-blue-400 cursor-pointer font-Italianno hover:drop-shadow-md tracking-widest" >EchoPoint</h1>
                </div>
                 <div className="my-4">
                    <div className=" my-2 flex items-center px-4 py-2 rounded-full hover:bg-gray-100   hover:cursor-pointer">
                        <div>
                            <CiHome size="30px" />
                        </div>
                        <h1 className="ml-2 text-lg font-bold">Home</h1>
                    </div>  <div className=" my-2 flex items-center px-4 py-2 rounded-full hover:bg-gray-100   hover:cursor-pointer">
                        <div>
                            <GoHash size="30px" />
                        </div>
                        <h1 className="ml-2 text-lg font-bold">Saved Posts</h1>
                    </div>  <div className=" my-2 flex items-center px-4 py-2 rounded-full hover:bg-gray-100   hover:cursor-pointer">
                        <div>
                            <IoIosNotificationsOutline size="30px" />
                        </div>
                        <h1 className="ml-2 text-lg font-bold">Reported Posts</h1>
                    </div>
                    <div  className='flex items-center my-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer rounded-full'>
                        <div>
                            <CiUser size="24px" />
                        </div>
                        <h1 className='font-bold text-lg ml-2'>Profile</h1>
                    </div>
                   
                    <div className=" my-2 flex items-center px-4 py-2 rounded-full hover:bg-gray-100   hover:cursor-pointer">
                        <div>
                            <CiLogout size="30px" />
                        </div>
                        <h1 className="ml-2 text-lg font-bold">Logout</h1>
                    </div>
                 </div>
            </div>
        </div>
    )
}

export default Leftsidebar