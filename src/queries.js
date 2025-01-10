require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});


module.exports = {
    // Get all departments, ordered by id
    getDepartments: async () =>
      pool.query('SELECT id, name AS "Department Name" FROM department ORDER BY id;'),
  
    // Get all roles, ordered by id
    getRoles: async () =>
      pool.query(`
        SELECT role.id, role.title AS role, role.salary, department.name AS department 
        FROM role 
        JOIN department ON role.department_id = department.id
        ORDER BY role.id;
      `),
  
    // Get all employees, ordered by id
    getEmployees: async () =>
      pool.query(`
        SELECT 
          e.id, e.first_name, e.last_name, role.title AS role, 
          department.name AS department, role.salary, 
          CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        LEFT JOIN role ON e.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee m ON e.manager_id = m.id
        ORDER BY e.id;
      `),
    
    // Add a new department
  addDepartment: async (name) =>
    pool.query('INSERT INTO department (name) VALUES ($1)', [name]),

  // Add a new role
  addRole: async (title, salary, departmentId) =>
    pool.query(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
      [title, salary, departmentId]
    ),

  // Add a new employee
  addEmployee: async (firstName, lastName, roleId, managerId) =>
    pool.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [firstName, lastName, roleId, managerId]
    ),

  // Update an employee's role
  updateEmployeeRole: async (employeeId, roleId) =>
    pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]),
  
    // Update an employee's manager
    updateEmployeeManager: async (employeeId, managerId) =>
      pool.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [managerId, employeeId]),
  
    // Get employees by manager, ordered by id
    getEmployeesByManager: async (managerId) =>
      pool.query(
        `SELECT e.id, e.first_name, e.last_name, role.title AS role, department.name AS department
         FROM employee e
         JOIN role ON e.role_id = role.id
         JOIN department ON role.department_id = department.id
         WHERE e.manager_id = $1
         ORDER BY e.id;`,
        [managerId]
      ),
  
    // Get employees by department, ordered by id
    getEmployeesByDepartment: async (departmentId) =>
      pool.query(
        `SELECT e.id, e.first_name, e.last_name, role.title AS role
         FROM employee e
         JOIN role ON e.role_id = role.id
         WHERE role.department_id = $1
         ORDER BY e.id;`,
        [departmentId]
      ),
  
    
  };