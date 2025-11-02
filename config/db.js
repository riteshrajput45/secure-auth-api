const mongoose = require('mongoose');

const connnectDb = async()=>{
  try {
    await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DB_NAME}`)
    console.log("Mongodb is connected")
  } catch (error) {
    console.error("Mongodb connection error",error.message)
  }

}

module.exports =connnectDb