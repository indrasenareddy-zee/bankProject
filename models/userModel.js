const Sequelize = require("sequelize")
const db = require("../config/db")
const Transaction = require("./transactionModel")
const User = db.define('users',{
    id:{
        type:Sequelize.DataTypes.UUID,
        primaryKey:true,
        defaultValue:Sequelize.UUIDV4
    },
    email:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:true
    },
    firstName:{
        allowNull:false,
        type:Sequelize.STRING
    },
    lastName:{
        allowNull:false,
        type:Sequelize.STRING
    },
    phone:{
        allowNull:false,
        type:Sequelize.BIGINT,
        unique:true
    },
    password:{
        allowNull:false,
type:Sequelize.STRING
    },
    token:{
        type:Sequelize.STRING
    },
    amountBalance:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }
})

Transaction.belongsTo(User)
module.exports = User