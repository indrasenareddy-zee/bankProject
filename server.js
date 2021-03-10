var express = require("express")
var mysql = require("mysql2")
var connection = require("./config/db")
var bodyParser = require("body-parser")
var {auth} = require("./middleware/auth")
var authRoute = require("./routes/authRoute")
var userRoute = require("./routes/userRoute")
const db = require("./config/db")
var fs = require('fs');
var morgan = require('morgan');
const winston = require('./config/winston')
var app = express()
app.use(morgan('combined',{stream:winston.stream}));
app.use(bodyParser.json())
var PORT = process.env.PORT || 3000
app.use("/auth",authRoute)
app.use("/user",auth,userRoute)

var CronJob = require('cron').CronJob;
// every day at 11:59
// var job = new CronJob('59 23 * * * ', function() {
    var job = new CronJob('10 * * * * * ',async function() {
        var olddate= new Date
       var date=olddate.getDate()
       var month = olddate.getMonth()
       var year = olddate.getFullYear()
        console.log(olddate.getDate)
     await  fs.readFile('../logs/app.log',async(err,resp)=>{
            if(err){
                console.log(err)
            }
           await fs.writeFile(`../logs/${date}-${month}-${year}.log`,`${resp}`,(err)=>{
                if(err){
                    console.log(err)
                }
            })
            await fs.writeFile('../logs/app.log',`${date}-${month}-${year}`,(err)=>{
                if(err){
                    console.log(err)
                }
                console.log("file cleared")
            })
        })
  
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');
job.start();

app.get('/check',(req,res)=>{
    var olddate= new Date
    console.log(olddate.getDate())
    console.log(olddate.getMonth())
    console.log(olddate.getFullYear())
    return res.send("hello")
})

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


