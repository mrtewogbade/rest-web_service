const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('test-db', 'user', 'pass', {
    dialect: 'sqlite',
    storage: './dev.sqlite',
    host: ':memory:',
});


module.exports = sequelize;