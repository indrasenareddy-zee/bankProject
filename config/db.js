'use strict'
const { Sequelize } = require("sequelize")
const sequelize= new Sequelize('bank','root','password',{
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