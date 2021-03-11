var express = require("express")
var router = express.Router()
var {signup,signin, logout} = require("../controllers/authController")
router.post("/signup",signup)
router.post("/signin",signin)

 module.exports = router

 