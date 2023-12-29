const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../database')

class Article extends Model {};

Article.init({
    content: {
        type: DataTypes.STRING,
           allowNull: false,
    },

},{
    sequelize, 
    modelName: 'article',
    // removed timestamp because I want it to be automatically added to the table

});

module.exports = Article;

