const { Model, DataTypes } = require('sequelize');
const sequelize = require('./database')

class User extends Model {};

User.init({
    username: {
        type: DataTypes.STRING,
           allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
           allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
           allowNull: false,
    }
},{
    sequelize, 
    modelName: 'user',
    timestamps: false

});

module.exports = User;

