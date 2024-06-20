INSERT INTO department 
    (dept_name)
VALUES 
('SALES'),
('ENGINEERING'),
('FINANCE'),
('LEGAL');

INSERT INTO roles 
    (title, salary, department_id)
VALUES 
    ('Salesperson', 80000, 1),
    ('LeadEngineer', 90000, 2),
    ('Accountant', 100000, 3),
    ('Lawyer', 110000, 4);


INSERT INTO employee 
    (first_name, last_name, role_id, manager_id)
VALUES  
    ('Mike', 'Chan', 1, 4),
    ('Ashley', 'Rodriguez', 2 , 3),
    ('Kevin', 'Tupik', 3 , 5),
    ('Kumal', 'Singh', 4, 2);