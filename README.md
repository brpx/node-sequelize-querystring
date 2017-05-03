# Node Sequelize query string

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License](https://img.shields.io/npm/l/sequelize.svg?maxAge=2592000?style=plastic)](https://github.com/sequelize/sequelize/blob/master/LICENSE)

The aim of this module it to convert the request query string into sequelize compatible where and sort clauses.
The reason this new module exists are resumed in one word: minimalist

## Features so far:

- Convert filter attribute into where clauses
- Nested properties
- Supports almost every operator, whoever only eq is well tested (work in progress) 
- Convert sort attribute into order clause

## Usage

Example in a [hapijs compatible](https://hapijs.com/api#route-handler) request handler:

```javascript
  const sqs = require('sequelize-querystring')
  const ArticlesModel = require('./models/articles')

  // list articles
  exports.list = (req, res) => {
    return ArticlesModel.findAndCountAll({
      offset: req.query.offset || 0,
      limit: req.query.limit || 10,
      where: req.query.filter ? sqs.find(req.query.filter) : {},
      order: req.query.sort ? sqs.sort(req.query.sort) : []
    })
    .then((results) => {
      results.rows = results.rows.map((o) => { return o.get() })
      res(results)
    })
    .catch((err) => {
      log.error(err)
      res(err).code(500)
    })
  }
```

The compatible query string to filter and sort is like:
```
  http://localhost:3000/v1/articles?filter=author eq joaquim&sort=createdAt desc
```

The handler has pagination and by default it replies the first 10 items. To get the next page you could simply request:

```
  http://localhost:3000/v1/articles?filter=author eq joaquim&limit=10&offset=10
```

## Contribute

If you want to contribute your're welcome. Keep in mind:

- Test your fixes or improvements (npm test should pass)
- Keep it simple
