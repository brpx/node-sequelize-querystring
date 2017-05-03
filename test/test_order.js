'use strict'

const filter = require('../index.js')
const Chai = require('chai')
const expect = Chai.expect

describe('Convert query string sort attribute into Sequelize order queries.', (done) => {
  it('Sort convert to order by.', () => {
    let qs = 'geoId desc'
    let order = filter.sort(qs)
    expect(order).to.be.instanceof(Object)
    expect(order).to.be.instanceof(Array)
  })
})
