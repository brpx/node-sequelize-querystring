'use strict'

const _ = require('lodash')

const operators = [
  'and', 'or',
  'gt', 'gte', 'lt', 'lte', 'ne', 'eq',
  'not', 'between', 'notBetween',
  'in', 'notIn',
  'like', 'notLike', 'iLike', 'notILike', 'like',
  'overlap', 'contains', 'contained', 'any'
]

/**
 * Converts the find query string attribute into a where clause
 *
 * @param {any} qs expression
 * @returns {object} where
 */
exports.find = (expression) => {
  // filter=geoId eq 111, properties.publicoId  eq 1231
  let where
  if (expression.match(/(([\w|.]+)\s(\w+)\s(\w+),?)+/)) {
    let parts = (expression).split(',')
    where = { }
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].match(/([\w|.]+)\s(\w+)\s([\w|.|-]+)/)) {
        let prop = RegExp.$1
        let op = RegExp.$2
        let value = RegExp.$3
        if (operators.findIndex((o) => op === o) < 0) {
          throw new Error(`Invalid operator ${op}`)
        }
        _.set(where, `${prop}.$${op}`, value)
      }
    }
  }

  if (where == null) {
    throw new Error(`Invalid expression ${expression}`)
  }

  return where
}

/**
 * Converts the query string attribute sort into an order by
 *
 * @param {any} qs expression
 * @returns {array} order clause
 */
exports.sort = (expression) => {
  // order=geoId desc
  let order = []
  let exp = expression.split(' ')
  if (exp.length === 2) {
    let prop = exp[0]
    let ord = exp[1].toUpperCase()
    if (ord.match(/ASC|DESC/i)) {
      order.push([prop, ord.toUpperCase()])
    }
  }
  if (order == null) {
    throw new Error('Invalid order expression')
  }

  return order
}
