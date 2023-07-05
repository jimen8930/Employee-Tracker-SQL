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
    const employees = await db.query (`SELECT employee.id, employee.first_name AS "first name", employee.last_name 
    AS "last name", role.title, department.name AS department, role.salary, 
    concat(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee manager
    ON manager.id = employee.manager_id`);
    console.table(employees);
    startApp ();
  }

  async function addDepartment () {
    const departmentData = await inquirer.prompt ([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:',
      },
    ]);
    const { departmentName } = departmentData;
    await db.query('INSERT INTO department (name) VALUES (?)', [departmentName]);
    console.log('Department added successfully!');
    startApp();
  }

  async function addEmployee () {
    const roles = await db.query('SELECT * FROM role');
  const managers = await db.query('SELECT * FROM employee');

    const employeeData = await inquirer.prompt ([
      {
        name: "firstName",
        type: "input",
        message: "Enter their first name "
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter their last name "
      },
      {
      type: 'list',
      name: 'roleId',
      message: "Select the employee's role:",
      choices: roles.map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
    {
      type: 'list',
      name: 'managerId',
      message: "Select the employee's manager:",
      choices: [
        { name: 'None', value: null },
        ...managers.map((manager) => ({
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.id,
        })),
      ],
    },
  ]);

  const { firstName, lastName, roleId, managerId } = employeeData;

  await db.query(
    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
    [firstName, lastName, roleId, managerId]
  );

  console.log('Employee added successfully!');
  startApp();
  }

  async function updateEmployee() {
    // Retrieve employee data
    const employees = await db.query('SELECT * FROM employee');
    const roles = await db.query('SELECT * FROM role');

    // Prompt user to select an employee to update
    const employeeData = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select an employee to update:',
        choices: employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      },
      // Other fields to update (e.g., new role)
      {
        type: 'list',
        name: 'roleId',
        message: "Select the employee's new role:",
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
    ]);
  
    const { employeeId, roleId } = employeeData;
  
    // Update employee's role
    await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
  
    console.log('Employee role updated successfully!');
    startApp();
  }
  

  async function addRole () {
    const departments = await db.query('SELECT * FROM department');

    const roleData = await inquirer.prompt ([
      {
        name: "title",
        type: "input",
        message: "Enter the title of the role. "
      },
      {
        name: "salary",
        type: "number",
        message: "Enter the role's salary. "
      },
    {
      type: 'list',
      name: 'departmentId',
      message: "Select the department for the role:",
      choices: departments.map((department) => ({
        name: department.name,
        value: department.id,
        })),
    },
  ]);

  const { title, salary, departmentId} = roleData;

  await db.query(
    'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
    [title, salary, departmentId]
  );

  console.log('Role added successfully!');
  startApp();
  }
