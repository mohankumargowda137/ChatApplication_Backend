const express=require('express');
const morgan=require('morgan')
require('dotenv').config();
const userRouter= require('./routes/userRoutes')
const messageRouter=require('./routes/messageRoutes')


const app=express()
app.use(morgan('combined'))
app.use(express.json())
app.use('/user',userRouter)
app.use('/message',messageRouter)

app.listen(process.env.PORT,()=>{
    console.log("server started")
})