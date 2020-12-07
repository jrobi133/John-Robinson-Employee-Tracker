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



function viewAllRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  })
}

function viewAllDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  })
};


function addEmployee() {
  var currentRoles;
  var currentEmployees;

  connection.query("SELECT title, id from role", function (err, res) {
      if (err) throw err;
      var rolesArray = res.map(function (obj) {
          return { name: obj.title, value: obj.id };
      });

      currentRoles = rolesArray;


      connection.query("SELECT first_name, last_name, id from employee", function (err, res) {
          if (err) throw err;
          var employeeArray = res.map(function (obj) {
              return { name: obj.first_name + " " + obj.last_name, value: obj.id };
          });

          currentEmployees = employeeArray;

          inquirer
              .prompt([
                  {
                      name: "firstName",
                      type: "input",
                      message: "What is the first name of the new employee?"
                  },
                  {
                      name: "lastName",
                      type: "input",
                      message: "What is the last name of the new employee?"
                  },
                  {
                      name: "employRole",
                      type: "list",
                      message: "What is this employee's role?",
                      choices: currentRoles
                  },
                  {
                      name: "employManage",
                      type: "list",
                      message: "Who, if anyone, manages this employee?",
                      choices: currentEmployees
                  }

              ]).then(function (response) {
                  var query = "INSERT INTO employee SET ?"
                  connection.query(query, { first_name: response.firstName, last_name: response.lastName, role_id: response.employRole, manager_id: response.employManage }, function (err, res) {
                      if (err) throw err;
                      console.log(res.affectedRows + " Employee Added!\n");

                      runSearch();
                  });
              });
      });
  });
};

function addDepartment () {
  inquirer.prompt({
    name: "newDepartment",
    type: "input",
    message: "What is the name of the new department?"
  }).then(function (answer) {
    var query = "INSERT INTO department SET ?"
    connection.query(query, { name: answer.newDepartment }, function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + "New department had been added.");
      runSearch();
    })
  })
}

function addRole() {
  var currentDepartment;
  connection.query("SELECT name, id FROM department", function (err, res) {
    if (err) throw err;
    var departmentArray = res.map(function (obj) {
        return { name: obj.name, value: obj.id };
    });
    currentDepartment = departmentArray;
    

  inquirer.prompt([
    {
    name: "newRole",
    type: "input",
    message: "What is the name of the new role?"
  },
    {
    name: "roleSalary",
    type: "input",
    message: "How much salary does this roll get?"
  },
    {
    name: "roleDepartment",
    type: "list",
    message: "What department will this role be in?",
    choices: departmentArray
  }
  ]).then(function (answer) {
    var query = "INSERT INTO role SET ?"
    connection.query(query, { title: answer.newRole, salary: answer.roleSalary, department_id: answer.roleDepartment }, function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + "New role has been added.");
      runSearch();
    })
  })
})
};

// function updateEmployeeRole() {
//   let records = (callback, []) ([
//     connection
//     .promise()
//     .query(`SELECT id, title FROM role ORDER BY title ASC;`)
//     .then(([rows, fields]) => {
//       return rows;
//     }),
//     connection
//     .promise()
//     .query(
//       `SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS Employee FROM employee ORDER BY Employee ASC;`,
//     )
//     .then(([rows, fields]) => {
//       return rows;
//     }),
//   ]);
//   let employeeArray = [];
//   let roleArray = [];

//   //update roles array
//   for (i = 0; i < records[0].length; i++) {
//     roleArray.push(records[0][i].title);
//   }

//   //update employee array
//   for (i = 0; i < records[1].length; i++) {
//     employeeArray.push(records[1][i].Employee);
//   }
//   inquirer
//       .prompt([{
//           name: "employee",
//           type: "list",
//           message: "Select an employee.",
//           choices: employeeArray,
//         },
//         {
//           name: "role",
//           type: "list",
//           message: "what is the new role?",
//           choices: roleArray,
//         },
//       ])
//       .then((answer) => {
//         //creating variables
//         let roleId;
//         let employeeId;

//         for (i = 0; i < records[0].length; i++) {
//           if (answer.role == records[0][i].title) {
//             roleId = records[0][i].id;
//           }
//         }

//         for (i = 0; i < records[1].length; i++) {
//           if (answer.employee == records[1][i].Employee) {
//             employeeId = records[1][i].id;
//           }
//         }
//         connection.query(
//           `UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId};`,
//           (err, res) => {
//             if (err) throw err;

//             console.log(`${answer.employee} role update to ${answer.role}...`);
//             //return to menu
//             callback();
//             connection.end();
//           },
//         );
//       });
// }
// -------------------------------------------------------------------------------------------------------------

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

