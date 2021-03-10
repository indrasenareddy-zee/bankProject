var express = require("express")
var router = express.Router()
var {checkBalance,oneToOneTransactions,lastTenTransactions,doTransaction,getMyProfile,generatePin} = require("../controllers/userController")
var{logout} = require("../controllers/authController")
router.get("/mybalance",checkBalance)
router.post("/doTransaction",doTransaction)
router.get("/getmyprofile",getMyProfile)
router.post("/generatepin",generatePin)
router.get("/lastten",lastTenTransactions)
router.get("/logout/:userId",logout)
router.post("/onetoone",oneToOneTransactions)


module.exports = router