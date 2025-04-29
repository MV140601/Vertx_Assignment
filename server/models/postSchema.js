import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    postId: { type: String, required: true, unique: true }, 
    title: { type: String, required: true},    
    content: { type: String, required: true },
    Platform:{ type: String, enum: ["Twitter", "Reddit"], default: "Reddit" },
    ActionType: { type: String, enum: ["Saved", "Reported"], default: "Saved" },  
    ActionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  
    ActionAt: { type: Date, default: null }   
}, { timestamps: true });

postSchema.index({ postId: 1 });
export const Posts = mongoose.model("Posts", postSchema);