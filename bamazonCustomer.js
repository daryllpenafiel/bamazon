var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 5000,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    readTable();
});

function readTable() {
    connection.query("SELECT item_id,product_name,price FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        customerBuy();
    })
}

function customerBuy() {
    inquirer.prompt([{
            name: "whichItem",
            type: "list",
            message: "Which product would you like to buy?",
            choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
        },
        {
            name: "itemQty",
            type: "input",
            message: "How much would you like to buy?",
            choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
        }
    ]).then(function (response) {
            console.log(response.whichItem);
            console.log(response.itemQty);
            connection.end();
        })
    };