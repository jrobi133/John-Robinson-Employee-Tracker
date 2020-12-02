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
      type: "rawlist",
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
        artistSearch();
        break;

      case "View All Employees By Department":
        multiSearch();
        break;

      case "View All Employees By Manager":
        rangeSearch();
        break;

      case "Add Employee":
        songSearch();
        break;

      case "Remove Employee":
        songAndAlbumSearch();
        break;

      case "Update Employee Role":
        songAndAlbumSearch();
        break;

      case "Update Employee Manager":
        songAndAlbumSearch();
        break;

      case "View All Roles":
        songAndAlbumSearch();
        break;

      case "Add Role":
        songAndAlbumSearch();
        break;

      case "View All Departments":
        songAndAlbumSearch();
        break;

      case "Add Department":
        songAndAlbumSearch();
        break;

      case "Remove Department":
        songAndAlbumSearch();
        break;

      case "Quit":
        songAndAlbumSearch();
        break;
      }
    });
}