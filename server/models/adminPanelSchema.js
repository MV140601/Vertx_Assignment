import mongoose  from "mongoose";
import { User } from "./userSchema";

const adminpanelSchema=new mongoose.Schema({
    userDataList:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reportedPostsList:[{ type: mongoose.Schema.Types.ObjectId, ref: "Posts" }],
})

export const AdminPanelSchema = mongoose.model("AdminPanelSchema", adminpanelSchema);