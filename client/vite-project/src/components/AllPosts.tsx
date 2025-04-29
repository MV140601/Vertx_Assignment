import React, { useEffect, useState } from "react";
import { Post } from "../models/post";
import axios from "axios";
import { CiBookmark } from "react-icons/ci";
import { MdOutlineReport } from "react-icons/md";
import { USER_API_END_POINT } from "../utils/constant";
 import { AppDispatch } from '../redux/store';
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from "../redux/store"; // adjust the path as needed
  import toast from "react-hot-toast";
  import socket from "../socketconnection/socket";

const AllPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
 useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Reddit posts
        const redditRes = await axios.get("https://www.reddit.com/r/javascript.json");
        const redditPosts: Post[] = redditRes.data.data.children.map((item: any) => ({
          id: item.data.id,
          title: item.data.title,
          content: item.data.selftext || "No content available",
          platform:"Reddit"
        }));
  
        // "Twitter" posts from DummyJSON
        const twitterRes = await axios.get("https://dummyjson.com/posts");
        const twitterPosts: Post[] = twitterRes.data.posts.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          content: item.body,
            platform:"Twitter"
        }));
  
        const maxLength = Math.max(redditPosts.length, twitterPosts.length);
        const interleaved: Post[] = [];

        for (let i = 0; i < maxLength; i++) {
          if (redditPosts[i]) interleaved.push(redditPosts[i]);
          if (twitterPosts[i]) interleaved.push(twitterPosts[i]);
        }

        setPosts(interleaved);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
  
    fetchPosts();
  }, []);
  const ReportpostHandler = async (postdata: Post) => {
    try {
      const res = await axios.post(`${USER_API_END_POINT}/report/${user?._id}`, { postId:postdata.id,title:postdata.title,content:postdata.content,Platform:postdata.platform }, {
        withCredentials: true
      });
      console.log(res);
      const updatedPosts = posts.filter((post) => post.id !== postdata.id);
      setPosts(updatedPosts);
      
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error);
    }
  };
  const handleReport = (postId: string, reporterId: string) => {
    if (user) {
      socket.emit("report-post", { reporterId: user._id, postId });
    } else {
      toast.error("User is not logged in");
    }
  };
  
  const SavepostHandler = async (postdata: Post) => {
    try {
      const res = await axios.post(`${USER_API_END_POINT}/bookmark/${user?._id}`, { postId:postdata.id,title:postdata.title,content:postdata.content,Platform:postdata.platform }, {
        withCredentials: true
      });
      console.log(res);
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error);
    }
  };
  
  return (
    <div className="p-[5px] max-h-screen overflow-y-auto flex flex-col items-center w-[80%]">
      <h1 className="text-2xl font-bold mb-4 text-blue-400 italic fixed z-10 bg-gray-300 w-[30%] flex flex-col text-center">AllPosts</h1>
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
            <div className="flex items-center" onClick={()=>{SavepostHandler(post)}}>
              <div title="Save" className="p-2 hover:bg-blue-200 rounded-full cursor-pointer">
                <CiBookmark size="24px" />
              </div>
            </div>
             <div className="flex items-center" onClick={()=>{ReportpostHandler(post)}}>
              <div title="Report" className="p-2 hover:bg-blue-200 rounded-full cursor-pointer">
                <MdOutlineReport size="24px" />
              </div>
            </div>
          </div>
          
        </div>
        
      ))}
      </div>
    </div>
  );
};

export default AllPosts;
