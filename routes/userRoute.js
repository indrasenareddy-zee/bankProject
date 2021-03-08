var express = require("express")
var router = express.Router()
var {checkBalance,lastTenTransactions,doTransaction,getMyProfile,generatePin} = require("../controllers/userController")

router.get("/mybalance",checkBalance)
router.post("/doTransaction",doTransaction)
router.get("/getmyprofile",getMyProfile)
router.post("/generatepin",generatePin)
router.get("/lastten",lastTenTransactions)


module.exports = router