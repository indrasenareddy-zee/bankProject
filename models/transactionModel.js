// const Sequelize = require("sequelize")
// const db = require("../config/db")
'use strict'
module.exports = (sequelize,DataTypes)=>{
    const Transaction = sequelize.define('transactions',{
        tid:{
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue:DataTypes.UUIDV4
        },
        amount:{
            allowNull:false,
            type:DataTypes.INTEGER
        },
        transactionStatus:{
     allowNull:false,
     type: DataTypes.STRING
        },
        content:{
            type: DataTypes.STRING
        },
        CreditedTo:{
            type:DataTypes.BIGINT
        },
        debitedFrom:{
            type:DataTypes.BIGINT
        }
    })
    return Transaction;
}

