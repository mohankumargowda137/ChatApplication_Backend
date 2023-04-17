const { createConversationQuery,checkConversationQuery } = require('../utility/transactionqueries')
const { Query }=require('../utility/query')
const moment = require('moment');

async function createConversation(req,res){
    const conversationData=req.body;
    const checkConversation=checkConversationQuery(conversationData);
    const existingConversation=await Query(checkConversation);
    if(existingConversation.length>0)
    {
        res.send({...existingConversation[0],message:"conversation already exist"})
        return 
    }
    
    const conversationQuery=createConversationQuery(conversationData);
    const newConversation = await Query(conversationQuery);
    res.send({conversation_id:newConversation.insertId})
    
}

async function updateLastMessage(req,res){
    const { conversationId }=req.body
    const date=moment().format( 'YYYY-MM-DD HH:mm:ss' )
    const lastMessage=await Query(`update conversation set last_conversed_date='${date}' where conversation_id=${conversationId}`)
    if(!lastMessage.error)
    res.send({message:"success"})
    else
    res.send({message:"error"})
}

module.exports={createConversation, updateLastMessage }