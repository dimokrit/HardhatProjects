const pkg = require('pg')
const { Pool } = pkg

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'OpenseaTB',
  password: 'amifot57',
  port: 5432,
})

module.exports.pool = pool