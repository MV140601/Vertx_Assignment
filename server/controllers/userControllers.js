import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

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
        RoleId,
        RewardPoints:50,
        Password: hashedPassWord
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

        let updatedUser = user;
      let welcomemessage=`Welcome back ${updatedUser.UserName}`;

        if ((!user.lastLoginAt || new Date(user.lastLoginAt) < today)&&user.Role==='Admin') {
            updatedUser = await User.findByIdAndUpdate(
                user._id,
                {
                    $inc: { RewardPoints: 10 },  
                    $set: { lastLoginAt: new Date() } 
                },
                { new: true }
            );
            welcomemessage=`Welcome back ${updatedUser.UserName},Your Reward Points have been added to your wallet.`;
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

export const Bookmark = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;  
        const postId = req.params.id;      

        if (!loggedInUserId || !postId) {
            return res.status(400).json({ message: "User ID and Post ID are required", success: false });
        }

        const user = await User.findById(loggedInUserId);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        
        const isBookmarked = user.bookmarks.includes(postId);

        if (isBookmarked) {
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: postId } });
            return res.status(200).json({ message: "Removed from bookmarks", success: true });
        } else {
            await User.findByIdAndUpdate(loggedInUserId, { $addToSet: { bookmarks: postId } }); 
            return res.status(200).json({ message: "Added to bookmarks", success: true });
        }

    } catch (error) {
        console.error("Error in Bookmark:", error);
        return res.status(500).json({
            message: "An error occurred",
            success: false,
        });
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