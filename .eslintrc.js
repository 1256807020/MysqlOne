/*
 * @Descripttion: 
 * @version: 0.0.1
 * @Author: supercandy
 * @Date: 2019-12-16 23:33:42
 * @LastEditors: supercandy
 * @LastEditTime: 2020-08-04 22:18:45
 */
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow end with ,
    'comma-dangle': 0,
    'space-before-function-paren': 0,
    // 解决data()后空格校验
    'indent': 0,
    'quotes': ['error', 'single'],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
