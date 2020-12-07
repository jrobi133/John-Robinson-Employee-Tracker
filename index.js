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


let departmentArray = [];
function viewAllEmployeesByDepartment() {
  
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

let roleArray = [];
let managerArray = [];
function viewAllRoles() {
  
  connection.query("SELECT title FROM role", function (err, res)  {
    for (i = 0; i < res.length; i++) {
      roleArray.push(res[i].title); 
    }
    inquirer
      .prompt({
        name: "role",
        type: "list",
        message: "Choose a role to search.",
        choices: roleArray
      })
      .then((answer) => {
        var query = `SELECT e.id AS ID, e.first_name AS 'FirstName', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${answer.role}' ORDER BY ID ASC;`
        connection.query(query, (err, res) => {
          if (err) throw err;
          console.table(res);
          runSearch();
        })
      })
  })
}

function addEmployee() {
  // prompt for info about the item being put up for auction
  connection.query("SELECT name FROM department", function (err, res) {
    for (i = 0; i < res.length; i++) {
      departmentArray.push(res[i].name); 
    }
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter new employees first name."
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter new employees last name."
      },
      {
        name: "role",
        type: "list",
        message: "What is the role of the new employee?.",
        choices: roleArray
      },
      {
        name: "manager",
        type: "list",
        message: "Who is the manager of the new employee?.",
        choices: managerArray
      },
      {
        name: "startingBid",
        type: "input",
        message: "What would you like your starting bid to be?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO auctions SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role: answer.role,
          category: answer.category,
          starting_bid: answer.startingBid || 0,
          highest_bid: answer.startingBid || 0
        },
        function(err) {
          if (err) throw err;
          console.log("Your auction was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
  })
}

// function addEmployee() {
//   let roleArray = [];
//       let managerArray = [];
//       const allResults = Promise.all([
//         connection
//         .promise()
//         .query(`SELECT id, title FROM role ORDER BY title ASC;`)
//         .then(([rows, fields]) => {
//           return rows;
//         }),
//         connection
//         .promise()
//         .query(
//           `SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC;`,
//         )
//         .then(([rows, fields]) => {
//           return rows;
//         }),
//       ]);

//       console.log(allResults);
//       for (i = 0; i < allResults[0].length; i++) {
//         roleArray.push(allResults[0][i].title);
//       }
//       for (i = 0; i < allResults[1].length; i++) {
//         managerArray.push(allResults[1][i].Employee);
//       }

//       console.log(roleArray);
//       console.log(managerArray);
//       inquirer
//         .prompt([{
//             name: "firstName",
//             type: "input",
//             message: "Enter first name of employee",
//             validate: (input) => {
//               if (input === "") {
//                 console.log(`Enter a name.`);
//                 return false;
//               }
//               return true;
//             },
//           },
//           {
//             name: "lastName",
//             type: "input",
//             message: "Enter last name of employee",
//             validate: (input) => {
//               if (input === "") {
//                 console.log(`Enter a name.`);
//                 return false;
//               }
//               return true;
//             },
//           },
//           {
//             name: "role",
//             type: "list",
//             message: "What is the role of the new employee?",
//             choices: roleArray,
//           },
//           {
//             name: "manager",
//             type: "list",
//             message: "who is the manager of the new employee?",
//             choices: managerArray,
//           },
//         ])
//         .then((answer) => {
//           let roleId = null;
//           let managerId = null;

//           for (i = 0; i < allResults[0].length; i++) {
//             if (answer.role == allResults[0][i].title) {
//               roleId = allResults[0][i].id;
//             }
//           }
//           for (i = 0; i < allResults[1].length; i++) {
//             if (answer.manager == allResults[1][i].Employee) {
//               managerId = allResults[1][i].id;
//             }
//           }

//           connection.query(
//             `INSERT INTO employee (first_name, last_name, role_id, manager_id)
//                   VALUES ("${answer.firstName}", "${answer.lastName}", ${roleId}, ${managerId});`,
//             (err, res) => {
//               if (err) return err;

//               console.log(
//                 `\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `,
//               );              
//               runSearch();
//             },
//           );
//         });
// }

// -----------------------------------------------------------------------------------

