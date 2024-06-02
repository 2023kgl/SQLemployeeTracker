const express = require('express');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
  console.log('Connected to the courses_db database!')
  )

  pool.connect() 
  pool.query()