DROP DATABASE IF EXISTS employee_manager;
CREATE DATABASE employee_manager;

\c employee_manager;

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    dept_name VARCHAR(30)
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    manager_id INTEGER
);