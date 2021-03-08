var express = require("express")
var router = express.Router()
var {checkBalance,doTransaction,getMyProfile,generatePin} = require("../controllers/userController")

router.get("/mybalance",checkBalance)
router.post("/doTransaction",doTransaction)
router.get("/getmyprofile",getMyProfile)
router.post("/generatepin",generatePin)


module.exports = router