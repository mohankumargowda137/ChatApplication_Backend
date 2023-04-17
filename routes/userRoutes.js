const express = require('express');
const { authenticatedUser, getUserConversations, getUnconversedUsers }= require('../controller/userController')

const userRouter=express.Router();

userRouter.post("/authenticatedUser",authenticatedUser)
userRouter.post("/getUserConversations",getUserConversations)
userRouter.post("/getUnconversedUsers",getUnconversedUsers)

module.exports=userRouter