var express = require("express")
var mysql = require("mysql2")
var connection = require("./config/db")
var bodyParser = require("body-parser")
var {auth} = require("./middleware/auth")
var authRoute = require("./routes/authRoute")
var userRoute = require("./routes/userRoute")
const db = require("./config/db")
var morgan = require('morgan');
const winston = require('./config/winston')
var app = express()
app.use(morgan('combined',{stream:winston.stream}));
app.use(bodyParser.json())
var PORT = process.env.PORT || 3000
app.use("/auth",authRoute)
app.use("/user",auth,userRoute)


connection.sequelize.sync({
}).then(()=>{
    console.log("sql connection established")
    app.listen(PORT,(req,res)=>{
        console.log(`runnign on ${PORT}`)
    })
}).catch((err)=>{
    console.log("here")
    winston.error(`errno:${err.original.errno || 500} - code: ${err.original.code} -msg: ${err.original.sqlMessage}`);
    
})


