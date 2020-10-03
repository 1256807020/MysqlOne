// SPDX-License-Identifier: SimPL-2.0;
pragma solidity >=0.4.16 <0.8.0;
// 版本申明
// contract 关键字新建合约
contract Counter{
  // 变量必须申明类型
  uint num;
  constructor() {
    num = 0;
  }
  // 函数类型  共用函数
  function increment() public {
    num += 1;
  }
  // view函数，只读取变量，不写
  // 声明返回值类型
  function getNum() public view returns (uint) {
    return num;
  }
}