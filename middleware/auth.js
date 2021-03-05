const jwt = require("jsonwebtoken");
var User = require("../models/userModel")
var validation = require("../errorfiles/errorCodes.json")
exports.auth = async(req,res,next)=>{
    if( !req.headers || !req.headers.authorization){
        return res.status(401).json(validation.AUTHORIZATION_HEADER)
    }
    const token = req.headers.authorization.split(' ')[1];
    var decoded;
    await jwt.verify(token,"jwtsecret",(err,resp)=>{
        if (err){
            console.log("in")
            return res.status(401).json(validation.ILLEGAL_JWT_TOKEN)
    }
    decoded = resp
    })
    req.user = await User.findByPk(decoded.id)
    next()
    }

    