var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 5000,
    user: "root",
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
        console.log(res);
        customerBuy();
    })
}

function customerBuy() {
    inquirer.prompt([{
            name: "whichItem",
            type: "list",
            message: "Which product would you like to buy? Please choose by item_id.",
            choices: ["1", "2","3","4","5","6","7","8","9","10"]
        },
        {
            name: "itemQty",
            type: "input",
            message: "How many pieces would you like to buy?"
        }
    ]).then(function (response) {
            connection.query('SELECT * FROM `products` WHERE `item_id` = ?', [response.whichItem], function (error, results, fields) {
            var stockOnHand = results[0].stock_quantity;
            var itemPrice = results[0].price;
            var totalPrice = itemPrice*response.itemQty;

            if (stockOnHand >= response.itemQty) {
                connection.query('UPDATE `products` SET stock_quantity = stock_quantity - ? where `item_id` = ?', [response.itemQty, response.whichItem]);
                console.log("We have enough stock. Your total is: $" + totalPrice + ".");
                connection.end();
            } else {
                console.log("Sorry we don't have enough stock. Please try again next time.");
                connection.end();
            }
        })
    })
}
