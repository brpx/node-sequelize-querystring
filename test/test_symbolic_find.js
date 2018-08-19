'use strict'

const Chai = require('chai')
const expect = Chai.expect

const sequelize = require('./sequelize-mock')
const sqs = require('../index').withSymbolicOps(sequelize)

describe('.filter() with symbolic = true', () => {

  it('should build the where object with Op symbols', () => {
    let queryString = 'date eq 28-05-2000'
    let where = sqs.find(queryString)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('date')
    expect(where.date).to.have.property(sequelize.Op['eq'], '28-05-2000')
  })

})
