const inquirer = require('inquirer');
// connect to postgres
const pool = require('./db/connect'); 

// LOGO
const logo = require('asciiart-logo');
const config = require('./package.json');
console.log(logo(config).render());

// Start server after DB connection
pool.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    promptQuestions();
});


//add to database by user inputs

var promptQuestions = function () {
    inquirer.prompt([{
        // start prompt
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View All Department', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Log Out']
    }]).then((answers) => {

    // View
        if (answers.prompt === 'View All Department') {
            viewDept()

        } else if (answers.prompt === 'View All Roles') {
           viewRoles()

        } else if (answers.prompt === 'View All Employees') {
           viewEmployees()

    // Add
        } else if (answers.prompt === 'Add A Department') {
           addDept()

        } else if (answers.prompt === 'Add A Role') {
            addRoles();
           
        } else if (answers.prompt === 'Add An Employee') {
            addEmployee()

        } else if (answers.prompt === 'Update An Employee Role') {
            updateEmployeeRole ()

        } else if (answers.prompt === 'Log Out') {
            pool.end();
            console.log("Good-Bye!");
        }
    })
};

// VIEW

function viewDept () {
    pool.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;
        console.log("Viewing All Departments: ");
        console.table(result.rows);
        promptQuestions();
    });
}

function viewRoles() {
    pool.query(`SELECT * FROM roles`, (err, result) => {
        if (err) throw err;
        console.log("Viewing All Roles: ");
        console.table(result.rows);
        promptQuestions();
    });
}

function viewEmployees () {
    pool.query(`SELECT * FROM employee`, (err, result) => {
        if (err) throw err;
        console.log("Viewing All Employees: ");
        console.table(result.rows);
        promptQuestions();
    });
}

// ADD

function addDept () {
    inquirer.prompt([{
        type: 'input',
        name: 'department',
        message: 'What is the name of the department?',
        validate: departmentInput => {
            if (departmentInput) {
                return true;
            } else {
                console.log('Please Add A Department!');
                return false;
            }
        }
    }]).then((answers) => {
        pool.query(`INSERT INTO department (dept_name) VALUES ($1)`, [answers.department], (err, result) => {
            if (err) throw err;
            console.log(`Added ${answers.department} to the database.`)
            promptQuestions();
        });
    })
}

function addRoles () {
    pool.query(`SELECT * FROM department`, (err, result) => {
        
        if (err) throw err;
        
        let departments = result.rows;
        const departmentOptions = departments.map(({ id, dept_name }) => ({ name: dept_name , value: id}));
        
    inquirer.prompt([
            {
    // role
                type: 'input',
                name: 'role',
                message: 'What is the name of the role?',
                validate: roleInput => {
                    if (roleInput) {
                        return true;
                    } else {
                        console.log('Please Add A Role!');
                        return false;
                    }
                }
            },
            {
    // salary
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log('Please Add A Salary!');
                        return false;
                    }
                }
            },
            {
    // department
                type: 'list',
                name: 'department',
                message: 'Which department does the role belong to?',               
                choices: departmentOptions
            }
        ]).then((answers) => {

            pool.query(`INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)`, [answers.role, answers.salary, answers.department], (err, result) => {
                if (err) throw err;
                console.log(`Added ${answers.role} to the database.`)
                console.log(answers)
                promptQuestions();
            });
          })
        })}

function addEmployee () {
    pool.query(`SELECT * FROM employee`, (err, result) => {
        if (err) throw err;

        let employee = result.rows;
        const managersOptions = employee.map(({ first_name , id }) => ({ name: first_name , value: id}))

        pool.query(`SELECT title, id FROM roles`, (err, result ) => {
            if (err) throw err;
            let roles = result.rows;
            const rolesOptions = roles.map(({ id, title }) => ({ name: title , value: id}));  

        inquirer.prompt([
            {
        // Add employee first name
                type: 'input',
                name: 'firstName',
                message: 'What is the employees first name?',
                validate: firstNameInput => {
                    if (firstNameInput) {
                        return true;
                    } else {
                        console.log('Please Add A First Name!');
                        return false;
                    }
                }
            },
            {
        // add employee last name
                type: 'input',
                name: 'lastName',
                message: 'What is the employees last name?',
                validate: lastNameInput => {
                    if (lastNameInput) {
                        return true;
                    } else {
                        console.log('Please Add A Salary!');
                        return false;
                    }
                }
            },
            {
    // add employee role
                type: 'list',
                name: 'role',
                message: 'What is the employees role?',
                choices: rolesOptions
            },
            {
    // adding employee manager
                type: 'list',
                name: 'manager',
                message: 'Who is the employees manager?',
                choices: managersOptions
            }
        ]).then((answers) => {

            pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [answers.firstName, answers.lastName, answers.role, answers.manager], (err, result) => {
                if (err) throw err;
                console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                promptQuestions();
            });
        })
    });
})
}

// update  

function updateEmployeeRole() {
// Call the database to get the roles and managers
    pool.query(`SELECT first_name , id FROM employee`, (err, result) => {
        if (err) throw err;

        let employees = result.rows;
        const employeeOptions = employees.map(({ id, first_name }) => ({ name: first_name , value: id}));

        pool.query(`SELECT title, id FROM roles`, (err, result ) => {
            if (err) throw err;
            let roles = result.rows;
            const rolesOptions = roles.map(({ id, title }) => ({ name: title , value: id}));        

    inquirer.prompt([
        {
        // Choose an Employee to Update
        type: 'list',
        name: 'employee',
        message: 'Which employees role do you want to update?',
        choices: employeeOptions
        },
        {
        // update the new role
        type: 'list',
        name: 'role',
        message: 'What is their new role?',
        choices: rolesOptions
        }
        ]).then((answers) => {
    console.log(answers)
        pool.query(`UPDATE employee SET role_id = ($1) WHERE id = ($2)`, [ answers.role, answers.employee ], (err, result) => {
    console.log(answers.role , answers.employee);
            if (err) throw err;
            console.log(`Updated role for employee ID ${answers.employee} to role ID ${answers.role}.`)
            promptQuestions();
            });
        })
    });
    })
}