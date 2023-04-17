const express=require('express');
const { createConversation, updateLastMessage }=require("../controller/messageController")

const messageRouter=express.Router()

messageRouter.post('/createConversation',createConversation)
messageRouter.post('/updateLastMessage',updateLastMessage)

module.exports=messageRouter