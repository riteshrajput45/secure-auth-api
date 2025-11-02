require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT  || 6000
const connectDb = require('./config/db')
const router = require('./src/router/userRouter')
const errorHandler =require('./src/middlewares//errorHandler')
connectDb() 


app.use(express.json())
app.use('/api/v1',router)
app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`PORT is runnign on ${PORT}`)
})
