import mongoose  from "mongoose";
import { User } from "./userSchema";

const adminpanelSchema=new mongoose.Schema({
    userDataList:{type:{User},default:[]}
})

export const AdminPanelSchema = mongoose.model("AdminPanelSchema", adminpanelSchema);