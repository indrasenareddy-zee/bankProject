var db = require("../config/db")
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken")
var validator = require('validator');
var errors = require("../errorfiles/errorCodes.json")
const { Op } = require("sequelize");
const blogger = require('../config/blogger');

const winston = require('../config/winston')

var validation = require("../validations/userValidation")
//signup
exports.signup = async(req,res)=>{
    try{
    console.log("in")
     var {firstName,lastName,email,phone,password} = req.body
     if(!firstName || !lastName || !email || !phone || !password){
         return res.status(400).json(errors.BAD_REQUEST)
     }
if(!validator.isEmail(email) || !validation.passwordValidate(password)){
    return res.status(400).json(errors.BAD_REQUEST)
}
     //check user already exists
     var user = await db.users.findOne({
        where:{
        [Op.or]:[
        { phone:req.body.phone},
    {email:req.body.email}]}})
     if(user){
         return res.status(409).json({msg:"user already registered with same mobile number or email"})
     }
     var accountNumber =await generateAccountNumber()
     console.log(accountNumber)
     var password = await bcrypt.hash(req.body.password,10)
     var user ={
         email:email,
         firstName:firstName,
         lastName:lastName,
         phone:phone,
         accountNumber:accountNumber,
         password:password
             }
             console.log(user)
     await db.users.create(user).then((response)=>{
         console.log(response)
         return res.status(200).json(response)
     }).catch((err)=>{
         console.log("in")
         winston.error('hello')
         winston.error(`${err} - filename:authController - line:49`)
         return res.status(406).json({err})
     })
    }catch(err){
    winston.error(`${err}- filename:authController - line:49`)
    }
 }

 exports.signin = async(req,res)=>{
    console.log(req.body.phone)
    var user = await db.users.findOne({
        where:{ phone:req.body.phone}})
    if(!user){
       return res.status(404).json({msg:"user not found"})
    }
    var matchPassword = await bcrypt.compare(req.body.password,user.password)
    console.log(matchPassword)
    if(!matchPassword){
       return res.status(401).json({msg:"invalid credentials"})
    }
    var token = await jwt.sign({username:user.username,email:user.email,id:user.id},'jwtsecret',{expiresIn:"1h"})
   var refreshToken = await jwt.sign({username:user.username,email:user.email,id:user.id},'jwtsecret',{expiresIn:"5h"})
   user.token = token
   user.refreshToken = refreshToken
    user.save()
   console.log("here",user)
//     await user.update({
//        token :token,
//        refreshToken:refreshToken
//    })
  
    return res.status(200).json(user)
   }


   async function generateAccountNumber(){
       console.log("here")
    var accountNumber = `${Math.floor(Math.random() * 1000)}`+`${Date.now()}`
    var data = await db.users.findOne({
        where:{accountNumber:accountNumber}
    })
    console.log("data",data)
    if(data){
        return generateAccountNumber()
    }else{
        return accountNumber
    }
   }

   exports.logout = async(req,res)=>{
var user = await db.users.findOne({
    where:{id: req.params.userId}})
user.token = "NA"
user.refreshToken = "NA"
user.save()
return res.status(200).json({msg:"loggedout"})
   }