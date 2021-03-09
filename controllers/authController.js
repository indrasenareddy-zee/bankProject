var User = require("../models/userModel")
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken")
var validator = require('validator');
var errors = require("../errorfiles/errorCodes.json")

var validation = require("../validations/userValidation")
//signup
exports.signup = async(req,res)=>{
    console.log("in")
     var {firstName,lastName,email,phone,password} = req.body
     if(!firstName || !lastName || !email || !phone || !password){
         return res.status(400).json(errors.BAD_REQUEST)
     }
if(!validator.isEmail(email) || !validation.passwordValidate(password)){
    return res.status(400).json(errors.BAD_REQUEST)
}
     //check user already exists
     var user = await User.findOne({
        where:{ phone:req.body.phone}})
     if(user){
         return res.status(409).json({msg:"user already registered"})
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
     await User.create(user).then((response)=>{
         console.log(response)
         return res.status(200).json(response)
     }).catch((err)=>{
         return res.status(406).json({err})
     })
 }

 exports.signin = async(req,res)=>{
    console.log(req.body.phone)
    var user = await User.findOne({
        where:{ phone:req.body.phone}})
    if(!user){
       return res.status(404).json({msg:"user not found"})
    }
    var matchPassword = await bcrypt.compare(req.body.password,user.password)
    console.log(matchPassword)
    if(!matchPassword){
       return res.status(401).json({msg:"invalid credentials"})
    }
    var token = await jwt.sign({username:user.username,id:user.id},'jwtsecret',{expiresIn:"1h"})
   await user.update({
       token :token
   })
   console.log(user)
    return res.status(200).json(user)
   }


   async function generateAccountNumber(){
       console.log("here")
    var accountNumber = `${Math.floor(Math.random() * 1000)}`+`${Date.now()}`
    var data = await User.findOne({
        where:{accountNumber:accountNumber}
    })
    console.log("data",data)
    if(data){
        return generateAccountNumber()
    }else{
        return accountNumber
    }
   }