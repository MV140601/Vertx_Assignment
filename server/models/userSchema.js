import mongoose from "mongoose";
import { Posts } from "./postSchema.js";

const userSchema = new mongoose.Schema({
    UserName: { type: String, required: true, unique: true }, 
    Email: { type: String, required: true, unique: true },    
    Password: { type: String, required: true },
    Role: { type: String, enum: ["User", "Admin"], default: "User" },  
    Age: { type: Number, default: 18 },
    About: { type: String },
    RewardPoints: { type: Number, default: 0 },
    likedPosts: { type: [String], default: [] },     
    savedPosts: { type: [String], default: [] }, 
    reportedPosts: { type: [String], default: [] }, 
    lastLoginAt: { type: Date, default: null }    
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
