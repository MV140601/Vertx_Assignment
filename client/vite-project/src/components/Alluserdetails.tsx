import React, { useEffect, useState } from 'react';
import { USER_API_END_POINT } from '../utils/constant';
import { RootState } from "../redux/store";  
import { useSelector } from "react-redux";
import axios from 'axios';
import { User } from '../models/userModel';
import toast from "react-hot-toast";
import socket from "../socketconnection/socket";

const Alluserdetails = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const AllUsers = await axios.get(`${USER_API_END_POINT}/getallusers/${user?._id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });

          const filteredUsers: User[] = AllUsers.data.otherUsers.map((u: any) => ({
            _id: u._id,
            UserName: u.UserName,
            Email: u.Email,
            Role: u.Role,
            RewardPoints: u.RewardPoints,
          }));
        
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [user]);
  const handleRewardChange = (index: number, newPoints: number) => {
    const updated = [...users];
    updated[index].RewardPoints = newPoints;
    setUsers(updated);
  };
 

  const handleSave = async (id: string, points: number) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${USER_API_END_POINT}/updatereward/${id}`,
        { RewardPoints: points },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      
      socket.emit("reward-updated", {
        userId: id,
        message: `🎉 Your reward points have been updated to ${points}`
      });

      toast.success(res.data.message);
    } catch (error) {
      console.error("Failed to update reward points", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {users.map((u, index) => (
        <div key={u._id} style={{ border: "1px solid #ccc", borderRadius: 8, marginBottom: 15, padding: 12 }}>
          <p><strong>Username:</strong> {u.UserName}</p>
          <p><strong>Email:</strong> {u.Email}</p>
          <p><strong>Role:</strong> {u.Role}</p>
          <div>
            <label>
              <strong>Reward Points:</strong>
              <input
                type="number"
                value={u.RewardPoints || 0}
                onChange={(e) => handleRewardChange(index, parseInt(e.target.value))}
                style={{ marginLeft: 10, width: 80 }}
              />
            </label>
            <button
              onClick={() => handleSave(u._id, u.RewardPoints)}
              className='bg-blue-500 p-4 text-center rounded-md text-white font-bold ml-4'
            >
              Save
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Alluserdetails;
