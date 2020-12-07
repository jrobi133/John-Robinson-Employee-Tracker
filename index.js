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

function updateEmployeeRole() {
  var employees;
  var currentRoles;

  connection.query("SELECT title, id from role", function (err, res) {
    if (err) throw err;
      var rolesArray = res.map(function (obj) {
        return{ name:obj.title, value: obj.id };
      });
      currentRoles = rolesArray;

      connection.query("SELECT first_name, last_name, id from employee", function(err, res) {
        if (err) throw err;
        var employeeArray = res.map(function (obj) {
          return { name: obj.first_name + " " + obj.last_name, value: obj.id };
        });
        employees = employeeArray;

        inquirer.prompt([
          {
            name: "employeeName",
            type: "list",
            message: "Which employees role is changing?",
            choices: employees
          },
          {
            name:"newRole",
            type:"list",
            message:"What is their new role?",
            choices: currentRoles
          }
        ]).then(function (answer) {
          var query = "UPDATE employee SET ? WHERE ?";
          connection.query(query, [{ role_id:answer.newRole }, {id: answer.employeeName }], function (err, res){
            if(err) throw err;
            console.log(res.affectedRows + " Role has been changed.");
            runSearch();
          })
        })
      })
  })
};