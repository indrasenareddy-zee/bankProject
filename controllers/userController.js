var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt")
const db = require("../config/db")
var CryptoJS = require("crypto-js");
var Transaction = require("../models/transactionModel")
var User = require("../models/userModel");
exports.checkBalance = async(req,res) => {
    console.log("user",req.user)
return res.status(200).json({balance:req.user.amountBalance})
}

exports.doTransaction = async(req,res) => {
    console.log(req.body)
    console.log(req.user.amountBalance)
    if(req.user.amountBalance < req.body.amount){
        return res.status(400).json({msg:"insufficient funds"})
    }
    if(!req.user.pin){
        return res.status(400).json("please generate pin to do transaction")
    }
    if(req.body.accountNumber == req.user.accountNumber){
        return res.status(400).json("you cannot transfer money to your account")
    }
  var user = await User.findOne({
     where:{ accountNumber:req.body.accountNumber}})
     if(!user){
        return res.status(400).json({msg:"Account Number incorrect"})
     }
     await user.update({
         amountBalance:user.amountBalance + req.body.amount
     })
     await req.user.update({
         amountBalance:req.user.amountBalance-req.body.amount
     })
     var transaction = {
         amount:req.body.amount,
         transactionStatus:"success",
         CreditedTo:user.accountNumber,
         content:req.body.content,
         userId:req.user.id
     }
     var newTransaction = await Transaction.create(transaction)
  return res.status(200).json({msg:"transaction successfull",newTransaction})
}

exports.getMyProfile = async(req,res)=>{
    var user = await User.findByPk(req.user.id)
    var debited =  await Transaction.findAll({where:{userId:req.user.id}})
    var credited = await Transaction.findAll({where:{CreditedTo:req.user.accountNumber}})
    return res.status(200).json({user,debited,credited})
}

exports.generatePin = async(req,res)=>{
    var secretPin = CryptoJS.AES.encrypt(`${req.body.pin}`, 'secretforpin').toString();
    console.log(secretPin)
    var user = await User.findByPk(req.user.id)
    await user.update({
        pin:secretPin
    })
    return res.status(200).json(req.user)

}


