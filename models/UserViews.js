const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class UserViews extends Model {}

UserViews.init({
  telegramId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postTitle: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'UserViews' // We need to choose the model name
});

module.exports = UserViews;