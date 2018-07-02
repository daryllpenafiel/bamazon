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
    askManager();
});

//ASK MANAGER WHAT THEY WANT TO DO
function askManager() {
    inquirer.prompt([{
        name: "process",
        type: "list",
        message: "Please select from below.",
        choices: ["View products for sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function (response) {
        switch (response.process) {
            case "View products for sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            default:
                console.log("Please select again.");
                askManager();
                break;
        }
    })
};


// 1 - LISTS ALL PRODUCTS
function viewProducts() {
    connection.query("SELECT * from products", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log("Item id: " + res[i].item_id);
            console.log("Product Name: " + res[i].product_name);
            console.log("Retail Price: " + res[i].price);
            console.log("Stock on hand : " + res[i].stock_quantity);
            console.log("------------------------------");
        }
        connection.end();
    })
};

// 2 - VIEW LOW INVENTORY
function viewLowInventory() {
    connection.query("SELECT * from products where stock_quantity < 5", function (err, res) {
        if (err) throw err;
        if (res.length == 0) {
            console.log("We don't have any items with a stock level below 5 at the moment.");
            connection.end();
        } else {
            console.log("The following items are low inventory items (below 5 in stock): ");
            for (i = 0; i < res.length; i++) {
                console.log("Item id: " + res[i].item_id);
                console.log("Product Name: " + res[i].product_name);
                console.log("Retail Price: " + res[i].price);
                console.log("Stock on hand : " + res[i].stock_quantity);
                console.log("------------------------------");
            }
            connection.end();
        } 
    })
};

// 3 - ADD TO INVENTORY
function addToInventory() {
    //lists all products
    connection.query("SELECT * from products", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " - " + res[i].product_name);
            console.log("Stock on hand : " + res[i].stock_quantity);
            console.log("------------------------------");
        }
    });
    //asks which item to add and how much
    inquirer.prompt([{
            name: "whichItem",
            type: "input",
            message: "Which item would you like to add inventory to? Please input item_id."
        },
        {
            name: "itemQty",
            type: "input",
            message: "How many pieces would you like to add to the current stock?"
        }
    ]).then(function (response) {
        connection.query('UPDATE `products` SET stock_quantity = stock_quantity + ? where `item_id` = ?', [response.itemQty, response.whichItem]);
        console.log("The inventory has been updated.");
        connection.end();
    })
};


//ADD NEW ITEM
function addNewProduct() {
    inquirer.prompt([{
            name: "newItemName",
            type: "input",
            message: "Please enter product name of new item."
        },
        {
            name: "newItemDept",
            type: "list",
            message: "Choose department of new item.",
            choices: ["Electronics", "Fashion", "Kitchen", "Office Supplies", "Other"]
        },
        {
            name: "newItemPrice",
            type: "input",
            message: "Please enter retail price of new item."
        },
        {
            name: "newItemStock",
            type: "input",
            message: "Please enter initial inventory quantity of new item."
        }
    ]).then(function (response) {
        connection.query('INSERT into `products` (product_name,department_name,price,stock_quantity) VALUES (?,?,?,?)', [response.newItemName, response.newItemDept, response.newItemPrice, response.newItemStock]);
        console.log("New product created.");
        connection.end();
    })
};