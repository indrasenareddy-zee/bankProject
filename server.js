var express = require("express")
var mysql = require("mysql2")
var connection = require("./config/db")
var bodyParser = require("body-parser")
var app = express()
app.use(bodyParser.json())
var PORT = process.env.PORT || 3098
connection.sync({
}).then(()=>{
    console.log("sql connection established")
    app.listen(process.env.PORT)
}).catch((err)=>{
    console.log(err)
})