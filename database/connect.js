const mysql = require('mysql2/promise.js');

let connection;

const connectToDB=async function (){
    try {
        
    const test = await mysql.createPool({
    host: 'sql7.freemysqlhosting.net',
    user: 'sql7729154',
    password: 'EG3kBmd8R4',
    database: 'sql7729154',
    waitForConnections: true,
    queueLimit: 0
  });
  connection=test;
    console.log("your database is connected to mySQL !")
          
    } catch (error) {
        console.log(error)
        console.log("error while connecting to db")
    }
}

const getConnetion= function (){
    if(connection){
        return connection
    }
}

module.exports={
    connectToDB:connectToDB,
    getConnetion:getConnetion
}

