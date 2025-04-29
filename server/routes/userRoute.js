import express from "express";
import {Register,Login, Logout, getMyProfile, getallUsers,UpdateRole,GetAllReportedPosts,GetReportedPosts,GetSavedPosts,BookmarkPost, ReportPost, UpdateReward} from "../controllers/userControllers.js"
 import isAuthenticated from "../config/auth.js";
const router=express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(Logout);
router.route("/bookmark/:id").post(isAuthenticated,BookmarkPost);
router.route("/report/:id").post(isAuthenticated,ReportPost)
router.route("/profile/:id").get(isAuthenticated,getMyProfile);
router.route("/getallusers/:id").get(isAuthenticated,getallUsers);
router.route("/getmysavedposts/:id").get(isAuthenticated,GetSavedPosts);
router.route("/getmyreportedposts/:id").get(isAuthenticated,GetReportedPosts);
router.route("/getallreportedposts/:id").get(isAuthenticated,GetAllReportedPosts);
router.route("/updaterole/:id").post(isAuthenticated, UpdateRole);
router.route("/updatereward/:id").post(UpdateReward);
export default router; 