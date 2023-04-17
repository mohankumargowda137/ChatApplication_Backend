const { Query }=require('../utility/query')
const moment = require('moment');
const { getConversedUsersQuery, getUncoversedUsersQuery }=require('../utility/transactionqueries')

async function authenticatedUser(req,res){
    const userData=req.body;
    const checkNewUserQuery=`select * from  authenticated_users  where user_id='${userData.uid}' and email='${userData.email}'`;
    const checkNewUser=await Query(checkNewUserQuery);
    if(checkNewUser.length>0 && !checkNewUser.error)
    {
        const lastLogin= moment().format( 'YYYY-MM-DD HH:mm:ss' );
        const updateLastLogin=await Query(`update authenticated_users set last_login='${lastLogin}' where user_id='${userData.uid}'`);
        if(updateLastLogin.changedRows==1)
        res.send({message:"User signed in successfully."})
        else
        res.send({error:"Couldn't signin now, Please try again later."})
        return
    }

    const emailexistsquery=`select * from  authenticated_users  where email='${userData.email}'`
    const userWithEmailDifferentProvider= await Query(emailexistsquery);
    if(userWithEmailDifferentProvider.length>0 && !userWithEmailDifferentProvider.error)
    {
        res.send({error:"Email already registered from different provider, Please try other login methods."})
        return
    }

    const newUserQuery=`insert into authenticated_users (user_id,name,email,photourl,provider,idtoken) values ('${userData.uid}','${userData.name}','${userData.email}','${userData.photoURL}','${userData.provider}','${userData.idToken}')`
    const createNewUser=await Query(newUserQuery);
    if(createNewUser.error)
    res.send({error:"Couldn't signin now, Please try again later."})
    else
    res.send({message:"created new user successfully."});
}

async function getUserConversations(req,res){
    const userData=req.body;
    const query=getConversedUsersQuery(userData)
    const conversedUsersResult=await Query(query)
    console.log(userData)
    res.send(conversedUsersResult)

}

async function getUnconversedUsers(req,res){
    const userData=req.body;
    const query=getUncoversedUsersQuery(userData)
    const unconversedUsersResult=await Query(query)
    console.log(userData)
    res.send(unconversedUsersResult)
}

module.exports={ authenticatedUser, getUserConversations,getUnconversedUsers }