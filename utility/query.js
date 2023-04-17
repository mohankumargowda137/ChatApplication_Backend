const mysql = require("mysql");

const db_config = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
};

var connection;

function handleDisconnect() {
    connection = mysql.createConnection(db_config); 
  
    connection.connect(function(err) {             
      if(err) {                                     
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); 
      }
      console.log("connected successfully")                                     
    });                                     
                                            
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
        handleDisconnect();                         
      } else {                                      
        throw err;                                  
      }
    });
  }
  
handleDisconnect();



module.exports = {
    Query: (query) =>{
        return new Promise((resolve,reject)=>{
            
            connection.query(query,(err,result)=>{
                if(err){
                    resolve({error:err.sqlMessage})
                }
                else
                {
                    resolve(result)
                }
                
            })

        })
    }
}