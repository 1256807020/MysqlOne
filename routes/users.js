'use strict'
const Router = require('koa-router')
const router = new Router()
const User = require('../models/users')
// 校验器
const validator = require('validator')
const md5 = require('md5-node')
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
router.get('/create', async (ctx, next) => {
  const { username, password } = ctx.query
  const user = await User.create({
    username,
    password
  })
  ctx.body = {
    status: 10000,
    message: '注册成功',
    user
  }
  await next()
})
router.get('/list', async (ctx, next) => {
  const list = await User.findAll()
  const newList = []
  for (const item of list) {
    const obj = {
      id: item.id,
      username: item.username
    }
    newList.push(obj)
  }
  ctx.body = {
    status: 10000,
    message: '注册成功',
    newList,
    count: newList.length
  }
  await next()
})
router.get('/detail/:id', async (ctx, next) => {
  const { id } = ctx.params
  const user = await User.findOne({
    where: {
      id
    }
  })
  if (user) {
    const newUser = {
      id: user.id,
      username: user.username
    }
    ctx.body = {
      status: 10004,
      message: '查询成功',
      user: newUser
    }
    await next()
  } else {
    ctx.body = {
      status: 10003,
      message: '用户不存在',
      user
    }
    await next()
  }
})
module.exports = router.routes()
