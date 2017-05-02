const chai = require('chai')
const expect = chai.expect;
const spies = require('chai-spies')
chai.use(spies)

describe("simple math", function() {
    it('should add two numbers', () => {
      expect(2+2).to.equal(4)
    })
})

describe("setTimeout is approximately right amount of time", function() {
    it('should be ~ 1000 ms', (done) => {
      let befTime = Date.now()
      setTimeout(function() {
        let aftTime = Date.now() - befTime
        expect(aftTime).to.be.at.least(975)
        expect(aftTime).to.be.below(1025)
        done()
      }, 1000)
    })
})

describe("count function calls", function() {
  it('is called three times', () => {
    function squareNum(num) {
      return num*num
    }
    squareNum = chai.spy(squareNum)
    let arr = [1,2,3]
    arr = arr.map(num => {
      return squareNum(num)
    })
    expect(squareNum).to.have.been.called.exactly(3)
  })
})
