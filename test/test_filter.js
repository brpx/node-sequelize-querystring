'use strict'

const filter = require('../index.js')
const Chai = require('chai')
const expect = Chai.expect

describe('Convert query strings filter attribute into Sequelize find queries.', (done) => {
  // test string, integer and UUID
  it('(eq) Find convert equal operator to where.', () => {
    let qs = 'geoId eq 4301'
    let where = filter.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('geoId.$eq', '4301')
  })

  it('(eq) Find nested property convert equal operator to where.', () => {
    let qs = 'properties.externalId eq 4301'
    let where = filter.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('properties.externalId.$eq', '4301')
  })

  it('(eq) Find multiple properties, one nested and one simple.', () => {
    let qs = 'properties.externalId eq 4301, geoId eq 4301'
    let where = filter.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('properties.externalId.$eq', '4301')
    expect(where).to.have.deep.property('geoId.$eq', '4301')
  })

  it('(eq) UUID as a equal value.', () => {
    let qs = 'id eq fe277d7a-351d-4fb8-a0e1-64c43ebabc9c'
    let where = filter.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('id.$eq', 'fe277d7a-351d-4fb8-a0e1-64c43ebabc9c')
  })

  // test Date
  it('(eq) Date as a equal value.', () => {
    let date = new Date().toISOString()
    let qs = `startDate eq ${date}`
    let where = filter.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('startDate.$eq', date)
  })

  it('(like) Like operators force to search full field value.', () => {
    let qs = 'name like ricardo'
    let where = filter.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('name.$like', '%ricardo%')
  })

  it('(in) PosgreSQL In operator.', () => {
    let qs = 'list in ricardo'
    let where = filter.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('list.$in.0', '{ricardo}')
  })

  it('(in) PosgreSQL In operator, with multiple values.', () => {
    let qs = 'list in ricardo joao'
    let where = filter.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('list.$in.0', '{ricardo}')
    expect(where).to.have.deep.property('list.$in.1', '{joao}')
  })

  it('(notIn) PosgreSQL In operator.', () => {
    let qs = 'list notIn ricardo'
    let where = filter.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('list.$notIn.0', '{ricardo}')
  })
})
