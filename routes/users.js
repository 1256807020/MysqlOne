'use strict'
const Router = require('koa-router')
const router = new Router()
const User = require('../models/users')
// 校验器
const validator = require('validator')
const md5 = require('md5-node')
router.prefix('/api/users')
router.get('/', async ctx => {
  ctx.body = '/'
})
router.post('/register', async ctx => {
  const { username, password } = ctx.request.body
  console.log(username, password)
  if (validator.isEmpty(username) || validator.isEmpty(password)) {
    ctx.body = {
      status: 10001,
      message: '用户名或密码不能为空'
    }
  }
  const newpassword = md5(password)
  const name = await User.findOne({
    where: {
      username
    }
  })
  if (name) {
    ctx.body = {
      status: 10002,
      message: '用户名已存在'
    }
    return
  }
  console.log(username, newpassword)
  await User.create({ username, password: newpassword })
  ctx.body = {
    status: 10000,
    message: '注册成功'
  }
})
module.exports = router.routes()
