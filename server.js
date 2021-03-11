var express = require("express")
var mysql = require("mysql2")
var connection = require("./config/db")
var bodyParser = require("body-parser")
var {auth} = require("./middleware/auth")
var authRoute = require("./routes/authRoute")
var userRoute = require("./routes/userRoute")
const db = require("./config/db")
const blogger = require('./config/blogger');
var fs = require('fs');
const session = require('express-session');
var cookieParser = require('cookie-parser')
var morgan = require('morgan');
var cors = require('cors')
const winston = require('./config/winston')
var app = express()
// app.use(morgan('combined',{stream:winston.stream}));
app.use(bodyParser.json())
var PORT = process.env.PORT || 3000
app.use(cookieParser())
app.use(session({secret: 'secret'}));
app.use(function (req, res, next){
    var log = blogger.loggerInstance.child({
        id: req.id,
        body: req.body
    }, true)
    log.info({req: req})
    next();
});

// var corsOptions = {
//     origin: 'http://localhost:3001',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }

var allowlist = ['http://localhost:3004', 'http://localhost.3005']

app.use(function (req, res, next) {
    function afterResponse() {
        res.removeListener('finish', afterResponse);
        res.removeListener('close', afterResponse);
        var log = blogger.loggerInstance.child({
            id: req.id
        }, true)
        log.info({res:res}, 'response')
    }    res.on('finish', afterResponse);
    res.on('close', afterResponse);
    next();
});
app.post("/stuff", function (req, res) {

    var response = {
        fullname: `${req.body.firstname} ${req.body.lastname}`
    }
    blogger.logResponse(req.id, response, 200);
    res.status(200).send(response);
});
var CronJob = require('cron').CronJob;
// every day at 11:59
// var job = new CronJob('59 23 * * * ', function() {
    var job = new CronJob('0 0 1 * * * ',async function() {
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


var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    console.log("heree")
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        console.log("here")
      corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  }
  app.use(cors(corsOptionsDelegate))

app.use("/auth",authRoute)
app.use("/user",auth,userRoute)
app.get('/check',async(req,res)=>{
    await res.cookie('tokenss','token',{
        httpOnly:true,
        signed:false
    })
    console.log(req.session)
    var sess = req.session
    
    var olddate= new Date
    console.log(olddate.getDate())
    console.log(olddate.getMonth())
    console.log(olddate.getFullYear())
    return res.send("hello")
})

process.on('unhandledRejection', err => {
    console.log('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node.js docs)
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


