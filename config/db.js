'use strict'
const { Sequelize } = require("sequelize")
require('dotenv').config()
console.log(process.env.PASSWORD)
const sequelize= new Sequelize(`${process.env.DBNAME}`,`root`,`${process.env.PASSWORD}`,{
    dialect:'mysql'
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require("../models/userModel")(sequelize,Sequelize)
db.transactions = require("../models/transactionModel")(sequelize,Sequelize)

//relations
db.users.hasMany(db.transactions)
db.transactions.belongsTo(db.users)
module.exports = db