import express from "express";
import dotenv from "dotenv";
import databaseconnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

dotenv.config({ path: ".env" });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true  
}));
 databaseconnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

 app.use("/api/v1/user", userRoute);
app.get("/home", (req, res) => {
  res.status(200).json({ message: "coming from backend...." });
});

 const connectedUsers = {};  
const ADMIN_ID = "6810bade27f0e411f30ea790";  

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

   socket.on("register", (userId) => {
    connectedUsers[userId] = socket.id;
    console.log(`Registered: ${userId} with socket ${socket.id}`);
  });

   socket.on("report-post", ({ reporterId, postId }) => {
    console.log(`Post ${postId} reported by ${reporterId}`);

    const adminSocketId = connectedUsers[ADMIN_ID];
    if (adminSocketId) {
      io.to(adminSocketId).emit("admin-notification", {
        message: `User ${reporterId} reported post ${postId}`,
      });
    }
  });

   socket.on("reward-updated", ({ userId, newPoints }) => {
    console.log(`Admin updated points of ${userId} to ${newPoints}`);

    const userSocketId = connectedUsers[userId];
    if (userSocketId) {
      io.to(userSocketId).emit("reward-updated", {
        message: `Your reward points have been updated to ${newPoints}`,
      });
    }
  });

  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];
        break;
      }
    }
  });
});
 
server.listen(process.env.PORT, () => {
  console.log(`Server running with Socket.IO on port ${process.env.PORT}`);
});
