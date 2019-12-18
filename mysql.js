'use strict'
const Sequelize = require('sequelize')
const sequelize = new Sequelize('user', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306
})
sequelize.authenticate().then(() => {
  console.log('连接成功')
}).catch(err => {
  console.log('连接失败', err)
})
// 创建模型
const UserModel = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncreatement: true
  },
  username: Sequelize.STRING(100),
  password: Sequelize.STRING(100)
}, {
  timestamps: false
})
// UserModel.create({ username: 'studymysql', password: '123456' }).then(username => {
//   console.log(username.id)
// })
// UserModel.destroy({
//   where: {
//     username: 'studymysql'
//   }
// }).then(() => {
//   console.log('删除成功')
// })
// UserModel.update({ username: 'mysqlstudy' }, {
//   where: {
//     username: 'studymysql'
//   }
// }).then(() => {
//   console.log('修改成功')
// })
// UserModel.findAll().then((res) => {
//   console.log(JSON.stringify(res, null, 2))
// })
UserModel.findOne({
  where: {
    username: 'mysqlstudy1'
  }
}).then(res => {
  console.log(JSON.stringify(res, null, 2))
})
