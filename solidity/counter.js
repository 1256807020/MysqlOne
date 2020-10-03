class Counter {
  constructor(state) {
    this.num = 0
  }

  increment() {
    this.num++
  }

  getNum() {
    return this.num
  }
}
module.exports = Counter
