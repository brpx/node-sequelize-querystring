'use strict'

const Chai = require('chai')
const expect = Chai.expect

const sequelize = require('./sequelize-mock')
const sqsSym = require('../index').withSymbolicOps(sequelize)
const sqs = require('../index.js')


describe('Convert query strings into Sequelize find queries.', (done) => {
  it('(eq) Find convert equal operator with utf8letter to where.', () => {
    let qs = 'geoId eq 测试'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('geoId.$eq', '测试')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('geoId')
    expect(where.geoId).to.have.property(sequelize.Op.eq, '测试')
  })

  // test string, integer and UUID
  it('(eq) Find convert equal operator to where.', () => {
    let qs = 'geoId eq 4301'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('geoId.$eq', '4301')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('geoId')
    expect(where.geoId).to.have.property(sequelize.Op.eq, '4301')
  })

  it('(eq) Find nested property convert equal operator to where.', () => {
    let qs = 'properties.externalId eq 4301'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('properties.externalId.$eq', '4301')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('properties.externalId')
    expect(where.properties.externalId).to.have.property(sequelize.Op.eq, '4301')
  })

  it('(eq) Find multiple properties, one nested and one simple.', () => {
    let qs = 'properties.externalId eq 4301, geoId eq 4301'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('properties.externalId.$eq', '4301')
    expect(where).to.have.deep.property('geoId.$eq', '4301')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('properties.externalId')
    expect(where.properties.externalId).to.have.property(sequelize.Op.eq, '4301')
    expect(where).to.have.property('geoId')
    expect(where.geoId).to.have.property(sequelize.Op.eq, '4301')
  })

  it('(eq) UUID as a equal value.', () => {
    let qs = 'id eq fe277d7a-351d-4fb8-a0e1-64c43ebabc9c'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('id.$eq', 'fe277d7a-351d-4fb8-a0e1-64c43ebabc9c')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('id')
    expect(where.id).to.have.property(sequelize.Op.eq, 'fe277d7a-351d-4fb8-a0e1-64c43ebabc9c')
  })

  // test Date
  it('(eq) Date as a equal value.', () => {
    let date = new Date().toISOString()
    let qs = `startDate eq ${date}`
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('startDate.$eq', date)
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('startDate')
    expect(where.startDate).to.have.property(sequelize.Op.eq, date)
  })

  // test email
  it('(eq) Date as a equal value.', () => {
    let email = 'ricardo@brpx.com'
    let qs = `email eq ${email}`
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('email.$eq', email)
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('email')
    expect(where.email).to.have.property(sequelize.Op.eq, email)
  })

  it('(like) Like operator to match exact string.', () => {
    let qs = 'name like ricardo'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('name.$like', 'ricardo')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('name')
    expect(where.name).to.have.property(sequelize.Op.like, 'ricardo')
  })

  it('(like) Like operator to search full string value.', () => {
    let qs = 'name like %ricardo%'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('name.$like', '%ricardo%')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('name')
    expect(where.name).to.have.property(sequelize.Op.like, '%ricardo%')
  })

  it('(like) Like operator to match with wildcard at the beginning.', () => {
    let qs = 'name like %ricardo'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('name.$like', '%ricardo')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('name')
    expect(where.name).to.have.property(sequelize.Op.like, '%ricardo')
  })

  it('(like) Like operator to match with wildcard at the end.', () => {
    let qs = 'name like ricardo%'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('name.$like', 'ricardo%')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('name')
    expect(where.name).to.have.property(sequelize.Op.like, 'ricardo%')
  })

  it('(like) Like operator to match with wildcard in the middle.', () => {
    let qs = 'name like ri%do'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('name.$like', 'ri%do')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('name')
    expect(where.name).to.have.property(sequelize.Op.like, 'ri%do')
  })

  it('(like) Like operator to match with single character match wildcard.', () => {
    let qs = 'name like ric_rdo'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('name.$like', 'ric_rdo')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('name')
    expect(where.name).to.have.property(sequelize.Op.like, 'ric_rdo')
  })

  it('(like) Like operator to match using both wildcards.', () => {
    let qs = 'name like ric_r%o'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('name.$like', 'ric_r%o')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('name')
    expect(where.name).to.have.property(sequelize.Op.like, 'ric_r%o')
  })

  it('(iLike) case insensitive Like operator to search partial string value.', () => {
    let qs = 'name iLike ricardo%'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('name.$iLike', 'ricardo%')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('name')
    expect(where.name).to.have.property(sequelize.Op.iLike, 'ricardo%')
  })

  it('(in) PosgreSQL In operator.', () => {
    let qs = 'list in ricardo'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('list.$in.0', '{ricardo}')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('list')
    expect(where.list).to.have.property(sequelize.Op.in)
    expect(where.list[sequelize.Op.in]).to.have.property(0, '{ricardo}')
  })

  it('(in) PosgreSQL In operator, with multiple values.', () => {
    let qs = 'list in ricardo joao'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('list.$in.0', '{ricardo}')
    expect(where).to.have.deep.property('list.$in.1', '{joao}')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('list')
    expect(where.list).to.have.property(sequelize.Op.in)
    expect(where.list[sequelize.Op.in]).to.have.property(0, '{ricardo}')
    expect(where.list[sequelize.Op.in]).to.have.property(1, '{joao}')
  })

  it('(between) PosgreSQL Between operator, with multiple values.', () => {

    let today = new Date()
    let fromDate = today.toISOString()
    let toDate = new Date(today.getTime() + 34210800000 ).toISOString()

    let qs = `date between ${fromDate} ${toDate}`
    let where = sqs.find(qs)

    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('date.$between.0', `{${fromDate}}`)
    expect(where).to.have.deep.property('date.$between.1', `{${toDate}}`)
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('date')
    expect(where.date).to.have.property(sequelize.Op.between)
    expect(where.date[sequelize.Op.between]).to.have.property(0, `{${fromDate}}`)
    expect(where.date[sequelize.Op.between]).to.have.property(1, `{${toDate}}`)
  })

  it('(notBetween) PosgreSQL Not Between operator, with multiple values.', () => {
    let today = new Date()
    let fromDate = today.toISOString()
    let toDate = new Date(today.getTime() + 34210800000 ).toISOString()

    let qs = `date notBetween ${fromDate} ${toDate}`
    let where = sqs.find(qs)

    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('date.$notBetween.0', `{${fromDate}}`)
    expect(where).to.have.deep.property('date.$notBetween.1', `{${toDate}}`)
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('date')
    expect(where.date).to.have.property(sequelize.Op.notBetween)
    expect(where.date[sequelize.Op.notBetween]).to.have.property(0, `{${fromDate}}`)
    expect(where.date[sequelize.Op.notBetween]).to.have.property(1, `{${toDate}}`)
  })

  it('(notIn) PosgreSQL In operator.', () => {
    let qs = 'list notIn ricardo'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('list.$notIn.0', '{ricardo}')
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('list')
    expect(where.list).to.have.property(sequelize.Op.notIn)
    expect(where.list[sequelize.Op.notIn]).to.have.property(0, '{ricardo}')
  })

  it('PosgreSQL IS NULL (lower case).', () => {
    let qs = 'value eq null'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('value.$eq', null)
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('value')
    expect(where.value).to.have.property(sequelize.Op.eq, null)
  })

  it('PosgreSQL IS NULL (upper case).', () => {
    let qs = 'value eq NULL'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('value.$eq', null)
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('value')
    expect(where.value).to.have.property(sequelize.Op.eq, null)
  })

  it('PosgreSQL IS NOT NULL.', () => {
    let qs = 'value ne null'
    let where = sqs.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.deep.property('value.$ne', null)
    // test symbolic
    where = sqsSym.find(qs)
    expect(where).to.be.instanceof(Object)
    expect(where).to.have.property('value')
    expect(where.value).to.have.property(sequelize.Op.ne, null)
  })
})
