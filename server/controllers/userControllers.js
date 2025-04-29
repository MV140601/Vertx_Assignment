import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Posts } from "../models/postSchema.js";

export const Register = async (req, res) => {
    try {
      const { UserName, Email, Password,RoleId } = req.body;
      if (!UserName || !Email  || !Password||!RoleId) {
        return res.status(404).json({ message: "Please provide all the details", success: false })
      }
      const user = await User.findOne({ Email, Role: RoleId });
      if (user) {
        console.log("User Found", user);
        return res.status(401).json({
          message: "User Already Exists",
          success: false
        })
      }
      const hashedPassWord = await bcryptjs.hash(Password, 16);
      await User.create({
        UserName,
        Email,
        Role:RoleId,
        RewardPoints:50,
        Password: hashedPassWord,
        lastLoginAt: new Date()
      })
      return res.status(200).json({
        message: "Account Created Successfully,You have been rewarded with 50 points for creating an Account",
        success: true
      })
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        message: error,
        success: false
      })
    }
  }

  export const Login = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        console.log({ Email, Password });

        if (!Email || !Password) {
            console.log(req.body)
            return res.status(400).json({ message: "Please provide all the details", success: false });
        }

        const user = await User.findOne({ Email });

        if (!user) {
            return res.status(401).json({
                message: "Email ID does not exist, please register.",
                success: false
            });
        }

        const isMatch = await bcryptjs.compare(Password, user.Password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect Email or Password",
                success: false
            });
        }

         
        const today = new Date();
        today.setHours(0, 0, 0, 0);  
         console.log(!user.lastLoginAt);
        let updatedUser = user;
      let welcomemessage=`Welcome back ${updatedUser.UserName}`;

        if ((!user.lastLoginAt || new Date(user.lastLoginAt) < today)&&user.Role==='User') {
            updatedUser = await User.findByIdAndUpdate(
                user._id,
                {
                    $inc: { RewardPoints: 10 },  
                    $set: { lastLoginAt: new Date() } 
                },
                { new: true }
            );
            welcomemessage=`Welcome back ${updatedUser.UserName},Your daily login Reward Points have been added to your wallet.`;
            console.log("Reward points added for daily login!");
        }

        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: "1d" });

        return res.status(200)
            .cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
            .json({
                message:welcomemessage,
                user: updatedUser,
                success: true
            });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


  export const UpdateRole = async (req, res) => {
    try {
        const { UserName, Email, Password, RoleId } = req.body;

        if (!UserName || !Email || !Password || !RoleId) {
            return res.status(400).json({ message: "Please provide all the details", success: false });
        }

         
        const user = await User.findOne({ Email, Role: RoleId });

        if (!user) {
            console.log("User not Found", user);
            return res.status(404).json({
                message: "Account doesn't exist, Register First",
                success: false
            });
        }

        
        const hashedPassword = await bcrypt.hash(Password, 10);

         
        await User.updateOne(
            { _id: user._id },
            {
                $set: {
                    UserName: UserName,
                    Email:Email,
                    Role:RoleId,
                    Password: hashedPassword,
                    Role: RoleId
                }
            }
        );

        return res.status(200).json({
            message: "User details updated successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

export const BookmarkPost = async (req, res) => {
    try {
        const loggedInUserId = req.params.id;
        const { postId, title, content, Platform } = req.body;

        if (!loggedInUserId || !postId) {
            return res.status(400).json({ message: "User ID and Post ID are required", success: false });
        }

        const user = await User.findById(loggedInUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const isAlreadyBookmarked = user.savedPosts.includes(postId);

        if (isAlreadyBookmarked) {
            
            await User.findByIdAndUpdate(
                loggedInUserId,
                { $pull: { savedPosts: postId } },
                { new: true }
            );

            await Posts.findOneAndDelete({ postId });

            return res.status(200).json({ 
                message: "Post removed from bookmarks successfully", 
                success: true 
            });
        } else {
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            await Posts.create({
                postId,
                title,
                content,
                Platform,
                ActionType: "Saved",
                ActionBy: loggedInUserId,    
                ActionAt: today
            });

            await User.findByIdAndUpdate(
                loggedInUserId,
                {
                    $addToSet: { savedPosts: postId },
                },
                { new: true }
            );

            return res.status(200).json({ 
                message: "Post bookmarked successfully.", 
                success: true 
            });
        }

    } catch (error) {
        console.error("Error in BookmarkPost:", error);
        return res.status(500).json({
            message: "An error occurred",
            success: false,
        });
    }
};

export const GetSavedPosts = async (req, res) => {
    try {
        const loggedInUserId = req.params.id;

        if (!loggedInUserId) {
            return res.status(400).json({ message: "User ID is required", success: false });
        }

        const user = await User.findById(loggedInUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        
        const savedPosts = await Posts.find({ 
            postId: { $in: user.savedPosts } 
        });

        return res.status(200).json({
            message: "Fetched saved posts successfully.",
            success: true,
            data: savedPosts
        });

    } catch (error) {
        console.error("Error in GetSavedPosts:", error);
        return res.status(500).json({
            message: "An error occurred",
            success: false,
        });
    }
};


export const ReportPost = async (req, res) => {
    try {
        const loggedInUserId = req.params.id;   
        const {postId, title, content, Platform } = req.body;
      
        if (!loggedInUserId || !postId) {
            return res.status(400).json({ message: "User ID and Post ID are required", success: false });
        }

        const user = await User.findById(loggedInUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const isAlreadyReported = user.reportedPosts.includes(postId);

        if (isAlreadyReported) {
            
            await User.findByIdAndUpdate(
                loggedInUserId,
                { $pull: { reportedPosts: postId } },
                { new: true }
            );

             
            await Posts.findOneAndDelete({ postId });

            return res.status(200).json({ message: "Post unreported and deleted successfully", success: true });
        } else {
           
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const newReportedPost = await Posts.create({
                postId,
                title,
                content,
                Platform,
                ActionType: "Reported",
                ActionBy: loggedInUserId,
                ActionAt: today
            });

            await User.findByIdAndUpdate(
                loggedInUserId,
                {
                    $addToSet: { reportedPosts: postId  },
                    $inc: { RewardPoints: 5 }
                },
                { new: true }
            );

            return res.status(200).json({ 
                message: "Post reported successfully and 5 reward points credited.", 
                success: true 
            });
        }

    } catch (error) {
        console.error("Error in ReportPost:", error);
        return res.status(500).json({
            message: "An error occurred",
            success: false,
        });
    }
};

export const GetReportedPosts = async (req, res) => {
    try {
        const loggedInUserId = req.params.id;

        if (!loggedInUserId) {
            return res.status(400).json({ message: "User ID is required", success: false });
        }

        const user = await User.findById(loggedInUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Fetch posts from the Posts collection based on the reportedPosts array in User
        const reportedPosts = await Posts.find({ 
            postId: { $in: user.reportedPosts } 
        });

        return res.status(200).json({
            message: "Fetched reported posts successfully.",
            success: true,
            data: reportedPosts
        });

    } catch (error) {
        console.error("Error in GetReportedPosts:", error);
        return res.status(500).json({
            message: "An error occurred",
            success: false,
        });
    }
};


export const GetAllReportedPosts = async (req, res) => {
    try {
        const loggedInUserId = req.params.id;

        if (!loggedInUserId) {
            return res.status(400).json({ message: "User ID is required", success: false });
        }

        const user = await User.findById(loggedInUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const reportedPosts = await Posts.find({
            ActionType: { $in: "Reported" },
            ActionBy: { $ne: loggedInUserId }  
        }).populate({
            path: "ActionBy",
            select: "UserName Email"  
          });

        return res.status(200).json({
            message: "Fetched reported posts (not reported by you) successfully.",
            success: true,
            data: reportedPosts
        });

    } catch (error) {
        console.error("Error in GetReportedPostsNotByMe:", error);
        return res.status(500).json({
            message: "An error occurred",
            success: false,
        });
    }
};

export const UpdateReward=async(req, res)=>{
    const { id } = req.params;
  const { RewardPoints } = req.body;

  try {
    await User.findByIdAndUpdate(id, { RewardPoints });
    res.status(200).json({ message: "Reward points updated." });
  } catch (err) {
    res.status(500).json({ message: "Error updating reward points." });
  }
  };
 


export const getMyProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        return res.status(200).json({
            user,
        })
    } catch (error) {
        console.log(error);
    }
  };

  export const Logout = async (req, res) => {
    return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
      messgae: "Logged Out Successfully",
      success: true
    });
  }
  
  export const getallUsers = async (req, res) => {
    try {
      const {id} = req.params;
      const otherUsers = await User.find({_id:{$ne:id}}).select("-password");
      if(!otherUsers){
         return res.status(401).json({
             message:"Currently do not have any users."
         })
      };
      return res.status(200).json({
         otherUsers
     })
  } catch (error) {
     console.log(error);
  }
  }