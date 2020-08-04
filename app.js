'use strict'
const Koa = require('koa')

const body = require('koa-bodyparser')
const Router = require('koa-router')
const cors = require('koa-cors')
const path = require('path')
const koaStatic = require('koa-static')
const render = require('koa-art-template')
const pathPublic = path.resolve(__dirname, 'public')
const router = new Router()
const app = new Koa()
app.use(cors())
app.use(body())
// 使用静态文件目录
app.use(koaStatic(pathPublic))
// 配置模版引擎
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
})
app.use(async (ctx, next) => {
  await next()
  // 错误处理中间件
  if (ctx.status === 404) {
    ctx.status = 404
    await ctx.render('error')
  } else {
  }
})
// 配置公共信息
app.use(async (ctx, next) => {
  ctx.state.appname = 'koa学习'
  await next()
})
// 配置应用级中间件
router.use(async (ctx, next) => {
  console.log(ctx.query)
  console.log(ctx.querystring)
  console.log(ctx.url)
  console.log(ctx.request.header.host)
  ctx.state.__HOST__ = 'http://' + ctx.request.header.host
  await next()
})
let port = process.env.PORT || 3000
let users = require('./routes/users')
router.use('/users', users)
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(port, () => {
  console.log(`app is running ${port}`)
})
