const { Sequelize } = require("sequelize")
module.exports = new Sequelize('bank','root','password',{
    dialect:'mysql'
})