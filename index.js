var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Hunter15",
  database: "cm_systems"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Roles",
        "Add Role",
        "Remove Role",
        "View All Departments",
        "Add Department",
        "Remove Department",
        "Quit",
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View All Employees":
        viewAllEmployees();
        break;

      case "View All Employees By Department":
        viewAllEmployeesByDepartment();
        break;

      case "View All Employees By Manager":
        viewAllEmployeesByManager();
        break;

      case "Add Employee":
        addEmployee();
        break;

      case "Remove Employee":
        removeEmployee();
        break;

      case "Update Employee Role":
        updateEmployeeRole();
        break;

      case "Update Employee Manager":
        updateEmployeeManager();
        break;

      case "View All Roles":
        viewAllRoles();
        break;

      case "Add Role":
        addRole();
        break;

      case "View All Departments":
        viewAllDepartments();
        break;

      case "Add Department":
        addDepartment();
        break;

      case "Remove Department":
        removeDepartment();
        break;

      case "Quit":
        connection.end();
        break;
      }
    });
}

function viewAllEmployees() {
  connection.query("SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC;", function(err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  })
}

function viewAllEmployeesByDepartment() {
  let departmentArray = [];
  connection.query("SELECT name FROM department", function (err, res)  {
    for (i = 0; i < res.length; i++) {
      departmentArray.push(res[i].name); 
    }
    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "Choose a department to search.",
        choices: departmentArray
      })
      .then((answer) => {
        var query = `SELECT e.id AS ID, e.first_name AS 'FirstName', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = '${answer.department}' ORDER BY ID ASC;`
        connection.query(query, (err, res) => {
          if (err) throw err;
          console.table(res);
          runSearch();
        })
      })
  })
}