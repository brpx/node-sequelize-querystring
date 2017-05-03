'use strict'

const filter = require('../index.js')
const Chai = require('chai')
const expect = Chai.expect

describe('Convert query strings filter attribute into Sequelize find queries.', (done) => {
  it('Find convert to where.', () => {
    let qs = 'geoId eq 4301'
    let where = filter.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('geoId.$eq', '4301')
  })

  it('Find nested property convert to where.', () => {
    let qs = 'properties.externalId eq 4301'
    let where = filter.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('properties.externalId.$eq', '4301')
  })

  it('Find multiple properties, one nested and one simple.', () => {
    let qs = 'properties.externalId eq 4301, geoId eq 4301'
    let where = filter.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('properties.externalId.$eq', '4301')
    expect(where).to.have.deep.property('geoId.$eq', '4301')
  })

  it('UUID as a value.', () => {
    let qs = 'id eq fe277d7a-351d-4fb8-a0e1-64c43ebabc9c'
    let where = filter.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('id.$eq', 'fe277d7a-351d-4fb8-a0e1-64c43ebabc9c')
  })
})
