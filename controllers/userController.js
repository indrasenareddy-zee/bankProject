var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt")
const db = require("../config/db")
const { Op } = require("sequelize");
var nodeMailer = require("../utils/nodemailer")
var CryptoJS = require("crypto-js");
var Transaction = require("../models/transactionModel")
var User = require("../models/userModel");
// var Sequelize = require('sequelize');
const TIMESTAMP = require('sequelize-mysql-timestamp');
const { sequelize } = require("../models/transactionModel");
exports.checkBalance = async(req,res) => {
    console.log("user",req.user)
return res.status(200).json({balance:req.user.amountBalance})
}


exports.doTransaction = async(req,res) => {
    if(req.user.amountBalance < req.body.amount){
        return res.status(400).json({msg:"insufficient funds"})
    }
    if(!req.user.pin){
        return res.status(400).json("please generate pin to do transaction")
    }
    if(req.body.accountNumber == req.user.accountNumber){
        return res.status(400).json("you cannot transfer money to your account")
    }

  var credit_user = await db.users.findOne({
     where:{ accountNumber:req.body.accountNumber}})
     if(!credit_user){
        return res.status(400).json({msg:"Account Number incorrect"})
     }
     if(!req.body.pin){
        return res.status(400).json({msg:"Please enter pin"})
     }
     console.log(req.user.pin)
     var bytes  = CryptoJS.AES.decrypt(req.user.pin,'secretforpin');
     var originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log("orignal",originalText)
     if(originalText != req.body.pin){
         return res.status(400).json({msg:"pin mismatch"})
     }
   
     var transaction = {
         amount:req.body.amount,
         transactionStatus:"success",
         CreditedTo:credit_user.accountNumber,
         debitedFrom:req.user.accountNumber,
         content:req.body.content,
         userId:req.user.id
     }
     var newTransaction = await db.transactions.create(transaction)
     credit_user.amountBalance=credit_user.amountBalance + req.body.amount
     credit_user.save()
     req.user.amountBalance=req.user.amountBalance-req.body.amount
     req.user.save()
     nodeMailer.paymentRecieved(credit_user,newTransaction)
     nodeMailer.paymentSent(req.user,newTransaction)

  return res.status(200).json({msg:"transaction successfull",newTransaction})
}

exports.getMyProfile = async(req,res)=>{
    var user = await db.users.findByPk(req.user.id)
    var debited =  await db.transactions.findAll({where:{userId:req.user.id}})
    var credited = await db.transactions.findAll({where:{CreditedTo:req.user.accountNumber}})
    return res.status(200).json({user,debited,credited})
}

exports.generatePin = async(req,res)=>{
    var secretPin = CryptoJS.AES.encrypt(`${req.body.pin}`, 'secretforpin').toString();
    console.log("secretpin",secretPin)
    var user = await db.users.findByPk(req.user.id)
    await user.update({
        pin:secretPin
    })
    
    return res.status(200).json(user)

}

exports.lastTenTransactions = async(req,res)=>{
var transactions = await Transaction.findAll({
    where:{
        [Op.or]:[
{CreditedTo:req.user.accountNumber},
 {debitedFrom:req.user.accountNumber}
        ],
         createdAt:{
            [Op.between]:['2021-03-07','2021-03-09']
            }
    },
    order:[
        ['createdAt','DESC']
    ],
})


return res.status(200).json({userid:req.user.id,lenght:transactions.length, transactions})
}

exports.oneToOneTransactions = async(req,res)=>{

    return res.status(200).json(transactions)

    }