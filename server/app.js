import express from "express";
import dotenv from "dotenv";
import databaseconnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
const app=express();

dotenv.config({
    path:".env"
})
databaseconnection();
app.use(express.urlencoded({
    extends:true
}))
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin:"*",
    credentials:true
}
app.use(cors(corsOptions));

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});
app.use("/api/v1/user",userRoute);

app.get("/home",(req,res)=>{
    res.status(200).json({
        message:"coming from backend...."
    
    })
    })

    app.listen(process.env.PORT,()=>{
        console.log(`App is running on ${process.env.PORT} port`)
        })