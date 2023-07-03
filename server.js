const db=require('./db/connection');
const inquirer =require('inquirer');
const util =require('util');

db.query=util.promisify(db.query)
function startApp() {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'choice',
          message: 'What would you like to do?',
          choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Quit',
          ],
        },
      ])
      .then((options) => {
        switch (options.choice) {
          case 'View all departments':
            viewDepts()
            break;
  
          case 'View all roles':
            viewRoles()
            break;
  
          case 'View all employees':
            viewEmployees()
            break;
  
          case 'Add a department':
            addDepartment()
            break;
  
          case 'Add a role':
            addRole()
            break;
  
          case 'Add an employee':
            addEmployee()
            break;
  
          case 'Update an employee role':
            updateEmployee()
            break;
  
          case "Quit":
             db.close();    
           
        }
      })
  }
  async function viewDepts() {
const department= await db.query('select * from department');
console.table(department);
startApp ();
  }

  startApp ();

  async function viewRoles () {
    const roles = await db.query ('select role.id, role.title, role.salary, department.name from role join department on role.department_id = department.id');
    console.table(roles);
    startApp ();
  }
  
  async function viewEmployees () {
    const sql = `SELECT employee.id, employee.first_name AS "first name", employee.last_name 
    AS "last name", role.title, department.name AS department, role.salary, 
    concat(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee manager
    ON manager.id = employee.manager_id`
  }
