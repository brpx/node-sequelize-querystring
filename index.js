'use strict'

const utf8letters = require('./utf8letters.js')

const identity = (v) => v
const arrayHave = (v) => { return v.split(' ').map(v => { return isNaN(v) ? `{${v}}` : v }) }

/** @function
 * @description helper function used to construct query objects
 * (replacing _.set() to avoid importing all of underscore)
 */
const deepPropSet = (obj, dotPath, key, val) => {
  const props = dotPath.split('.')
  let here = obj
  props.forEach((prop, i) => {
    here = (here[prop] = here[prop] || {})
  })
  here[key] = val
}

/** @class
 *
 * @description Used to parse query strings and produce sort / filter objects 
 *  for sequelize querying
 */
class SequelizeQueryStringParser { 
  /** @constructor
   *
   * @param {Object} sequelize - the user's `require('sequelize')`
   * @param {Object} opts  - extra options to determine behaviour
   * @param {Boolean} opts.symbolic - whether to use symbolic Ops 
   *    or (deprecated) string Ops
   */
  constructor (sequelize, opts={}) {
    this.sequelize = sequelize
    this.symbolic = opts.symbolic || false
    if (opts.symbolic && !sequelize) {
      throw new Error('requested symbolic Ops but didn\'t provide Sequelize instance in constructor of SequelizeQueryStringParser (how are we going to look up the symbols?)')
    }
  }

  /** @method
   *
   * @description a helper method which allows the user to get a parser with 
   *    symbolic=true by doing: 
   *    `const sqs = require('sequelize-querystring').withSymbolicOps(sequelize)`
   *
   * @param {Object} sequelize - the user's `require('sequelize')`
   * @param {Object} opts  - extra options to determine behaviour
   * @param {Boolean} opts.symbolic - will be set to true regardless of passed value
   * @returns an instance of `SequelizeQueryStringParser` with symbolic=true.
   */
  withSymbolicOps (sequelize, opts={}) {
    return new SequelizeQueryStringParser(sequelize, 
      Object.assign(opts, {symbolic: true}))
  }

  /** @method
   *
   * @description returns a table keyed by operator strings that will appear in the
   *  GET query string (eg. 'gt'), where the values are objects with properties
   *  'op' and 'val', where `op` is the operator symbol or string (depending on 
   *  `this.symbolic`) and `val` is a function transforming the right-hand-side
   *  string in the GET query expression into an object which can be inserted into
   *  the sequelize query object.
   *
   * @returns {Object} - the map, with `op` for each operation being either a
   *  symbol (eg. Sequelize.Op.lt) or string (eg. '$lt') depending on `this.symbolic`
   */
  operators() {
    const identityOps = {
      valFunc: identity,
      ops: ['gt', 'gte', 'lt', 'lte', 'ne', 'eq', 'not', 'like', 
      'notLike', 'iLike', 'notILike']
    }
    const arrayHaveOps = {
      valFunc: arrayHave,
      ops: ['or', 'in', 'notIn', 'overlap', 'contains', 'contained', 'between', 'notBetween']
    }
    let resultMap = {}
    for (var opSet of [identityOps, arrayHaveOps]) {
      for (var op of opSet.ops) {
        resultMap[op] = {
          'op': (this.symbolic ? this.sequelize.Op[op] : `$${op}`), 
          'valFunc': opSet.valFunc
        }
      }
    }
    return resultMap
  }

  /** @method
   * 
   * Converts a query string into a where clause object for building 
   *    a sequelize query
   *
   * @param {String} expression - query string expression 
   *    (eg "geoId eq 111, properties.publicoId  eq 1231")
   * @returns {Object} the where clause for building the corresponding 
   *    Sequelize query
   */
  find (expression) {
    let where = {}
    if (expression.match(new RegExp(`(([\\w|.]+)\\s(\\w+)\\s([\\w|\\s|%|_|${utf8letters}]+),?)+`))) {
      let parts = (expression).split(',')
      const operators = this.operators()
      for (let i = 0; i < parts.length; i++) {
        // build a regexp to match filter expressions
        const lhs = '[\\w|.]+'
        const op = '\\w+'
        const rhs = `[A-Za-z0-9.+@:/()%_\\s\\-\\xAA\\xB5\\xBA${utf8letters}]+`
        const expressionRegExp = new RegExp(`(${lhs})\\s+(${op})\\s+(${rhs})`)
        if (parts[i].match(expressionRegExp)) {
          let prop = RegExp.$1
          let op = RegExp.$2
          let value = RegExp.$3
          if (!operators[op]) {
            throw new Error(`Invalid operator ${op}`)
          }
          const operator = operators[op]
          // if the value is null, dont use operator to force the "is null" or "is not null"
          if (value.match(/^null$/i) || value.match(/^undefined$/i)) {
            value = null
          }
          deepPropSet(where, prop, operator.op, operator.valFunc(value))
        }
      }
    }
    if (where == null) {
      throw new Error(`Invalid expression ${expression}`)
    }
    return where
  }

  /** @method
   *
   * Converts a query string into an order by
   *
   * @param {String} expression - query string expression
   *    (eg. "geoId desc")
   * @returns {Array} the order clause for building the corresponding Sequelize 
   *    query
   */
  sort (expression, sequelize) {
    // maintain backward-compatibility with v0.x.x, where users supply
    // their own sequelize object as the second param of sort()
    sequelize = sequelize || this.sequelize
    let order = []
    let expressions = expression.split(/\s*,\s*/)
    for (var e = 0; e < expressions.length; e++) {
      let exp = expressions[e].split(' ')
      if (exp.length === 2) {
        let prop = exp[0]
        let ord = exp[1].toUpperCase()
        if (ord.match(/ASC|DESC/i)) {
          order.push([prop, ord.toUpperCase()])
        }
      }
    }
    if (expression.match(/RANDOM/i)) {
      if (sequelize != null) {
        order = [sequelize.fn('RANDOM')]
      }
    }
    if (order == null) {
      throw new Error('Invalid order expression')
    }
    return order
  }

}

module.exports = new SequelizeQueryStringParser()
