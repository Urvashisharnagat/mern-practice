const mongoose = require('mongoose')

async function ConnectToDb() {
    try{
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("server is connected to database");
    }
    catch(error){
        console.log("cannot connect to datdabase :",error);
        process.exit(1)
    }
}

module.exports = ConnectToDb