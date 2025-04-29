import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config({
    path:"../config/.env"
})

const databaseconnection=()=>{
 mongoose.connect(process.env.MONGO_URI).then(()=>{console.log("Database Connection Successful")}).catch((err)=>{console.log("Issue in database connection: ",err.message)})
}

export default databaseconnection;