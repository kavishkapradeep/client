import express from "express"
import cors from "cors"
import 'dotenv/config'

import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRoutes.js"
import imageRouter from './routes/imageRoutes.js'
//app config

const app=express()
const port= process.env.PORT ||4000;

//middleware

app.use(express.json())
app.use(cors())
await connectDB();
app.use('/api/image',imageRouter)
app.use('/api/user',userRouter)
app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}`);
    
})