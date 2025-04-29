import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config({
    path:"../config/.env"
})
const isAuthenticated=async(req,res,next)=>{
try {
    console.log(req.cookies.token);
    const token=req.cookies.token;
     console.log(token);
     if(!token){
        return res.status(401).json({
            message:"User not Authenticated",
            success:false
        })
     }
     else{
        const decode=await jwt.verify(token,process.env.TOKEN_SECRET);
        console.log(decode);
        req.user=decode.id;
        console.log("auth successful")
        next();
     }  
} catch (error) {
    console.log(error.message)
}
}

export default  isAuthenticated;