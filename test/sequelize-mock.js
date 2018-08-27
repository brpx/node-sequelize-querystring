'use strict'

const getSequelizeMock = () => {
  const ops = ['eq', 'ne', 'gte', 'gt', 'lte', 'lt', 'not', 'is', 'in', 'notIn',
    'like', 'notLike', 'iLike', 'notILike', 'regexp', 'notRegexp', 'iRegexp',
    'notIRegexp', 'between', 'notBetween', 'overlap', 'contains', 'contained',
    'adjacent', 'strictLeft', 'strictRight', 'noExtendRight', 'noExtendLeft',
    'and', 'or', 'any', 'all', 'values', 'col', 'placeholder', 'join', 'raw',
    'Aliases', 'LegacyAliases']

  const sequelizeMock = {
    Op: {} 
  }

  for (var op of ops) {
    sequelizeMock.Op[op] = Symbol(op)
  }

  return sequelizeMock
}

module.exports = getSequelizeMock()
