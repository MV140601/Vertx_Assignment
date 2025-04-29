import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    UserName: "",
    Email: "",
    About: "",
    RewardPoints: 0,
    Role: "",
  });
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/profile/${user?._id}`, {
          withCredentials: true,
        });
        const { UserName, Email, About, RewardPoints, Role } = res.data.user;
        setFormData({ UserName, Email, About, RewardPoints, Role });
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${USER_API_END_POINT}/updateprofile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,  
        }
      );
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed.");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow w-[80%]">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            name="UserName"
            value={formData.UserName}
            onChange={handleChange}
            
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="Email"
            value={formData.Email}
            onChange={handleChange}
             
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">About</label>
          <textarea
            name="About"
            value={formData.About}
            onChange={handleChange}
            
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Reward Points</label>
          <input
            name="RewardPoints"
            type="number"
            value={formData.RewardPoints}
            onChange={handleChange}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Role</label>
          <input
            name="Role"
            value={formData.Role}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div className="flex justify-between flex flex-col items-center justify-between">
          {isEditing ? (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
            >
              Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
export default Profile;
