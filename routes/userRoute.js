var express = require("express")
var router = express.Router()
var {checkBalance} = require("../controllers/userController")

router.get("/mybalance",checkBalance)
module.exports = router