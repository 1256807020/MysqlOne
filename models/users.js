'use strict'
const { sequelize } = require('../core/db')
const { Sequelize, Model } = require('sequelize')
class User extends Model { }
// 定义模型
User.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false // 不为空
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'users',
  timestamps: false
})
module.exports = User
