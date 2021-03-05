const Sequelize = require("sequelize")
const db = require("../config/db")

const Transaction = db.define('transactions',{
    tid:{
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue:Sequelize.UUIDV4
    },
    amount:{
        allowNull:false,
        type:Sequelize.INTEGER
    },
    transactionStatus:{
 allowNull:false,
 type: Sequelize.STRING
    },
    content:{
        type: Sequelize.STRING
    },
    CreditedTo:{
        type:Sequelize.STRING
    }
})

module.exports = Transaction 