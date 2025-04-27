 import { CiSearch } from "react-icons/ci";
 const Rightsidebar = () => {
  return (
    <div className="w-[25%] " >
       <div className="p-2 bg-gray-100 rounded-full outline-none flex items-center w-full ">
        <CiSearch size={25} />
        <input type="text" className="bg-transparent outline-none px-2" placeholder="search" />
      </div>
       
    </div>
  )
}

export default Rightsidebar