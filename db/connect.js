const { Pool } = require('pg');
 
// Connect to database
const pool = new Pool(
    {
        // Enter PostgreSQL username
        user: 'postgres',
        // Enter PostgreSQL password
        password: 'postgres',
        host: 'localhost',
        database: 'employee_manager'
    },
    console.log('Connected to the Employee Tracker database!')
)

module.exports = pool