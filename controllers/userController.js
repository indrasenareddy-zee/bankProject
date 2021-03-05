var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt")

exports.checkBalance = async(req,res) => {
    console.log("user",req.user)
return res.status(200).json({balance:req.user.amountBalance})
}

