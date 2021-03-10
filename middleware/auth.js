const jwt = require("jsonwebtoken");
var db = require("../config/db")
var Op = require("sequelize")
var validation = require("../errorfiles/errorCodes.json")
exports.auth = async(req,res,next)=>{
    if( !req.headers || !req.headers.authorization || !req.headers.refreshtoken){
        return res.status(401).json(validation.AUTHORIZATION_HEADER)
    }
    const token = req.headers.authorization.split(' ')[1];
    var decoded;
  console.log(req.headers.refreshtoken)
    var tokenfound = await db.users.findOne({
        where:{
            token:token,
            refreshToken:req.headers.refreshtoken
        }
    })
    // console.log("...jjjjjjjjjjjjjjjjjjjj",tokenfound)
    // if(tokenfound){
    //     console.log("jddddddddddddddddd")
    // }else{
    //     console.log("zzzzzzzzzzzzzzzzzzz")
    // }

    if(!tokenfound){
        return res.status(401).json(validation.AUTHORIZATION_HEADER)

    }
    await jwt.verify(token,"jwtsecret",async (err,resp)=>{
        console.log(resp)
        if (err){
            console.log("in")
            console.log("response",err.name)
            if(err.name == 'TokenExpiredError'){
                refreshToken = req.headers.refreshtoken
                await jwt.verify(refreshToken,"jwtsecret",async (err,response)=>{
                if(err){
                    return res.status(401).json(validation.ILLEGAL_JWT_TOKEN)
                }else{
                    var user = await db.users.findOne({
                        where:{id:response.id}
                    })
                    var token = await jwt.sign({username:user.username,email:user.email,id:user.id},'jwtsecret',{expiresIn:"1m"})
                await user.update({
                    token:token
                })
                decoded = user
    req.user = await db.users.findByPk(decoded.id)
    next()
                }
                })
            }else{
            return res.status(401).json(validation.ILLEGAL_JWT_TOKEN)
    }
}else{
    console.log("direct")
    decoded = resp
    req.user = await db.users.findByPk(decoded.id)
    next()
}
    })
   
    }

    