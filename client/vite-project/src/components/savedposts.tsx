 import React, { useEffect, useState } from "react";
import { Post } from "../models/post";
import axios from "axios";
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from "../redux/store";  
import { USER_API_END_POINT } from "../utils/constant";
import { IoMdBookmark } from "react-icons/io";
import { MdOutlineReport } from "react-icons/md";

const Savedposts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const { user } = useSelector((state: RootState) => state.user);
    console.log("user from saved post",user);
    useEffect(() => {
      const fetchPosts = async () => {
        try {
           
          const token = localStorage.getItem("token"); // Or use Redux to get the token

          if (token) {
            const MySavedRes = await axios.get(`${USER_API_END_POINT}/getmysavedposts/${user?._id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true, // If you're using cookies
            });
            console.log(MySavedRes);
            const MySavedPosts: Post[] = MySavedRes.data.data.map((item: any) => ({
              id: item.postId,
              title: item.title,
              content: item.content || "No content available",
              platform:item.Platform
            }));
            setPosts(MySavedPosts);
          }

        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };
    
      fetchPosts();
    }, []);
  return (
     <div className="p-[5px] max-h-screen overflow-y-auto flex flex-col items-center w-[80%]">
          <h1 className="text-2xl font-bold mb-4 text-blue-400 italic fixed z-10 bg-gray-300 w-[30%] flex flex-col text-center">Saved Posts</h1>
          <div className="mt-10">{posts.map((post) => (
            <div
              key={post.id}
              className="mb-4 w-[95%] p-4 border rounded shadow-sm bg-gray-100 "
            ><div className="flex justify-between">
    
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <span className="text-sm italic">{post.platform}</span>
            </div>
            <div className="max-h-[200px] overflow-y-auto pr-2 text-gray-700 bg-white p-2 italic">
                {post.content || "No content available"}
              </div>
              <div className="flex justify-end">
                <div className="flex items-center"  >
                  <div title="Save" className="p-2 hover:bg-blue-200 rounded-full cursor-pointer">
                    <IoMdBookmark size="24px" />
                  </div>
                </div>
              </div>
              
            </div>
            
          ))}
          </div>
        </div>
  )
}

export default Savedposts