const Sequelize = require("sequelize")
const { validate } = require("../config/db")
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
    refreshToken:{
        type:Sequelize.STRING
    },
    amountBalance:{
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    pin:{
    type:Sequelize.STRING
},
accountNumber:{
    type:Sequelize.BIGINT,
    allowNull:false,
    unique:true
}
})

Transaction.belongsTo(User)
// User.hasMany(Transaction)
module.exports = User