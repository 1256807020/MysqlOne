'use strict'
const Koa = require('koa')
const users = require('./routes/users')
const body = require('koa-bodyparser')
const app = new Koa()
app.use(body())
app.use(users.routes(), users.allowedMethods())
app.listen(3000, () => {
  console.log('app running 3000')
})
