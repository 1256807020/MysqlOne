// SPDX-License-Identifier: SimPL-2.0;
pragma solidity >=0.4.16 <0.8.0;
// 版本申明
// contract 关键字新建合约
contract Counter{
  // 变量必须申明类型
  uint num;
  address owner;
  string name = 'counter';
  uint [5] arr = [1,2,3,4,5];
  arr[1] = 3;
  arr.push(6);
  for(uint i = 0;i<arr.length;i++){

  }
  mapping(string=>uint) users;
  users["address1"] = 100
  users["address2"] = 10
  // 所谓的代币，就是映射自己存储的值
  users["address1"] -= 10
  users["address2"] += 10
  // struct
  struct Students{
    uint age;
    uint id;
    uint name;
    uint phone;
  }
  counter = Students(18,0,'counter','123456789');
  enum sex {male,female};
  constructor() {
    num = 0;
    // msg.sender 谁部署合约，这个值就是谁
    owner = msg.sender;
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