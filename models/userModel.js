'use strict'

module.exports = (sequelize,DataTypes) =>{
    const User = sequelize.define('users',{
        id:{
            type:DataTypes.UUID,
            primaryKey:true,
            defaultValue:DataTypes.UUIDV4
        },
        email:{
            allowNull:false,
            type:DataTypes.STRING,
            unique:true
        },
        firstName:{
            allowNull:false,
            type:DataTypes.STRING
        },
        lastName:{
            allowNull:false,
            type:DataTypes.STRING
        },
        phone:{
            allowNull:false,
            type:DataTypes.BIGINT,
            unique:true
        },
        password:{
            allowNull:false,
    type:DataTypes.STRING
        },
        token:{
            type:DataTypes.STRING
        },
        refreshToken:{
            type:DataTypes.STRING
        },
        amountBalance:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        pin:{
        type:DataTypes.STRING
    },
    accountNumber:{
        type:DataTypes.BIGINT,
        allowNull:false,
        unique:true
    }
    })
    return User;
}



// Transaction.belongsTo(User)
// User.hasMany(Transaction)
// module.exports = User