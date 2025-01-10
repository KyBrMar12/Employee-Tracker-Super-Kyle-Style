const inquirer = require('inquirer');
const queries = require('./queries');

// Main menu function declaration
async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Update an employee manager', // Bonus
        'View employees by manager', // Bonus
        'View employees by department', // Bonus
        'Delete a department', // Bonus
        'Delete a role', // Bonus
        'Delete an employee', // Bonus
        'View department budget', // Bonus
        'Exit',
      ],
    },
  ]);

  switch (action) {
    case 'View all departments':
      console.table((await queries.getDepartments()).rows);
      break;

    case 'View all roles':
      console.table((await queries.getRoles()).rows);
      break;

    case 'View all employees':
      console.table((await queries.getEmployees()).rows);
      break;

    case 'Add a department': {
      const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the department name:',
      });
      await queries.addDepartment(name);
      console.log(`Added department: ${name}`);
      break;
    }

    case 'Add a role': {
      const { title, salary, departmentId } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter the role title:' },
        { type: 'input', name: 'salary', message: 'Enter the role salary:' },
        { type: 'input', name: 'departmentId', message: 'Enter the department ID:' },
      ]);
      await queries.addRole(title, salary, departmentId);
      console.log(`Added role: ${title}`);
      break;
    }

    case 'Add an employee': {
      const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        { type: 'input', name: 'firstName', message: "Enter the employee's first name:" },
        { type: 'input', name: 'lastName', message: "Enter the employee's last name:" },
        { type: 'input', name: 'roleId', message: "Enter the employee's role ID:" },
        { type: 'input', name: 'managerId', message: "Enter the manager's ID (or leave blank):" },
      ]);
      await queries.addEmployee(firstName, lastName, roleId, managerId || null);
      console.log(`Added employee: ${firstName} ${lastName}`);
      break;
    }

    case 'Update an employee role': {
      const { employeeId, roleId } = await inquirer.prompt([
        { type: 'input', name: 'employeeId', message: "Enter the employee's ID:" },
        { type: 'input', name: 'roleId', message: "Enter the new role ID:" },
      ]);
      await queries.updateEmployeeRole(employeeId, roleId);
      console.log('Updated employee role.');
      break;
    }

    case 'Update an employee manager': {
      const employees = (await queries.getEmployees()).rows;
      const { employeeId, managerId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee to update:',
          choices: employees.map((emp) => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })),
        },
        {
          type: 'list',
          name: 'managerId',
          message: 'Select the new manager:',
          choices: [...employees.map((emp) => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })), { name: 'None', value: null }],
        },
      ]);
      await queries.updateEmployeeManager(employeeId, managerId);
      console.log('Employee manager updated successfully.');
      break;
    }

    case 'View employees by manager': {
      const managers = (await queries.getEmployees()).rows;
      const { managerId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'managerId',
          message: 'Select a manager to view their employees:',
          choices: managers.map((mgr) => ({ name: `${mgr.first_name} ${mgr.last_name}`, value: mgr.id })),
        },
      ]);
      console.table((await queries.getEmployeesByManager(managerId)).rows);
      break;
    }

    case 'View employees by department': {
      const departments = (await queries.getDepartments()).rows;
      const { departmentId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'departmentId',
          message: 'Select a department to view its employees:',
          choices: departments.map((dept) => ({ name: dept.name, value: dept.id })),
        },
      ]);
      console.table((await queries.getEmployeesByDepartment(departmentId)).rows);
      break;
    }

    case 'Delete a department': {
      const departments = (await queries.getDepartments()).rows;
      const { departmentId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'departmentId',
          message: 'Select a department to delete:',
          choices: departments.map((dept) => ({ name: dept.name, value: dept.id })),
        },
      ]);
      await queries.deleteDepartment(departmentId);
      console.log('Department deleted successfully.');
      break;
    }

    case 'Delete a role': {
      const roles = (await queries.getRoles()).rows;
      const { roleId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'roleId',
          message: 'Select a role to delete:',
          choices: roles.map((role) => ({ name: role.title, value: role.id })),
        },
      ]);
      await queries.deleteRole(roleId);
      console.log('Role deleted successfully.');
      break;
    }

    case 'Delete an employee': {
      const employees = (await queries.getEmployees()).rows;
      const { employeeId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select an employee to delete:',
          choices: employees.map((emp) => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })),
        },
      ]);
      await queries.deleteEmployee(employeeId);
      console.log('Employee deleted successfully.');
      break;
    }

    case 'View department budget': {
      const departments = (await queries.getDepartments()).rows;
      const { departmentId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'departmentId',
          message: 'Select a department to view its total budget:',
          choices: departments.map((dept) => ({ name: dept.name, value: dept.id })),
        },
      ]);
      const budget = (await queries.getDepartmentBudget(departmentId)).rows[0];
      console.log(`Total Budget for Department: $${budget.total_budget}`);
      break;
    }

    case 'Exit':
      console.log('Goodbye!');
      process.exit();
  }

  mainMenu(); // Call the menu again after completing an action
}

// Call the mainMenu function to start the application
mainMenu();
