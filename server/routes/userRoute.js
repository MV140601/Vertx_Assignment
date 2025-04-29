import express from "express";
import {Register,Login, Logout, getMyProfile, getallUsers,UpdateRole} from "../controllers/userControllers.js"
import { Bookmark } from "../controllers/userControllers.js";
import isAuthenticated from "../config/auth.js";
const router=express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(Logout);
router.route("/bookmark/:id").put(isAuthenticated,Bookmark)
router.route("/profile/:id").get(isAuthenticated,getMyProfile);
router.route("/getallusers/:id").get(isAuthenticated,getallUsers);
router.route("/updaterole/:id").post(isAuthenticated, UpdateRole);
export default router; 