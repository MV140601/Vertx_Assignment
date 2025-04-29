import express from "express";
import dotenv from "dotenv";
import databaseconnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
const app=express();
import { Server } from "socket.io";
import http from "http";  
 
const server = http.createServer(app);
dotenv.config({
    path:".env"
})
databaseconnection();
app.use(express.urlencoded({
    extends:true
}))
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin:"http://localhost:5173",
    credentials:true
}
 

const io = new Server(server, {
    cors:corsOptions
  });
  const connectedUsers = {};

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // User register event to track connected users
    socket.on('register', (userId) => {
      connectedUsers[userId] = socket.id;
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });
  
    // Report post event (user reports a post)
    socket.on('report-post', ({ reporterId, postId }) => {
      console.log(`Post ${postId} reported by ${reporterId}`);
  
      // Notify admin (we assume admin is connected and has a different ID)
      const adminSocketId = Object.keys(connectedUsers).find(
        (userId) => userId !== reporterId
      );
  
      if (adminSocketId) {
        io.to(connectedUsers[adminSocketId]).emit('admin-notification', {
          message: `User ${reporterId} reported post ${postId}`,
        });
      }
    });
  
    // Update points event (admin updates reward points)
    socket.on('update-reward', ({ userId, newPoints }) => {
      console.log(`Updating points for user ${userId} to ${newPoints}`);
  
      // Notify the user that their points were updated
      if (connectedUsers[userId]) {
        io.to(connectedUsers[userId]).emit('reward-updated', {
          message: `Your reward points have been updated to ${newPoints}`,
        });
      }
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Remove the disconnected user from the tracking object
      for (const userId in connectedUsers) {
        if (connectedUsers[userId] === socket.id) {
          delete connectedUsers[userId];
          break;
        }
      }
    });
  });
  
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});
app.use("/api/v1/user",userRoute);

app.get("/home",(req,res)=>{
    res.status(200).json({
        message:"coming from backend...."
    
    })
    })

    server.listen(process.env.PORT, () => {
        console.log(`Server is running with socket.io on port ${process.env.PORT}`);
    });
    