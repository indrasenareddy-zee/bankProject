var express = require("express")
var mysql = require("mysql2")
var connection = require("./config/db")
var bodyParser = require("body-parser")
var {auth} = require("./middleware/auth")
var authRoute = require("./routes/authRoute")
var userRoute = require("./routes/userRoute")
var app = express()
app.use(bodyParser.json())
var PORT = process.env.PORT || 3089
app.use("/auth",authRoute)
app.use("/user",auth,userRoute)

connection.sync({}).then(()=>{
    console.log("sql connection established")
    app.listen(PORT,(req,res)=>{
        console.log(`runnign on ${PORT}`)
    })
}).catch((err)=>{
    console.log(err)
})


