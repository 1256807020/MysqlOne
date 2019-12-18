'use strict'
const Sequelize = require('sequelize')
const { host, port, user, password, dbName } = require('../config/config').databases
const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host: host,
  port: port,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  timezone: '+08:00' // 解决时差
})
sequelize.authenticate().then(() => {
  console.log('连接成功')
}).catch(err => {
  console.log('连接失败', err)
})
module.exports = { sequelize }
