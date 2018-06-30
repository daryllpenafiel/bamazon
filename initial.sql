DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT NOT NULL PRIMARY KEY auto_increment,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price decimal(4,2) NOT NULL,
    stock_quantity int(10) NOT NULL
);

INSERT INTO products (product_name,department_name,price,stock_quantity)
    VALUES 
    ("Earphones","Electronics",120,45),
    ("Keyboard","Electronics",80,40),
    ("iPhone","Electronics",900,55),    
    ("Quartz Watch","Fashion",200,40),
    ("Mechanical Watch","Fashion",1200,10),
    ("Cast Iron Skillet","Kitchen",60,65),
    ("Stand Mixer","Kitchen",400,20),
    ("Dutch Oven","Kitchen",65,30),
    ("Pen","Office Supplies",3,250),
    ("Copy Paper","Office Supplies",20,100);