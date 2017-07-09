var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "MartinD-28",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId);
});
function customerQuestions(){
connection.query("SELECT * FROM products", function(err, res) {
  if (err) throw err;
  console.log("Here's what's for sale!");
  console.log(res);
  shop();
});

function shop(){
inquirer.prompt([
      {
      	type: "input",
        name: "buy",
        message: "Welcome to Bamazon, please enter the ID number of the product you'd like to buy!",
     
      },
        {
      	type: "input",
        name: "number",
        message: "How many would you like to buy?",
     
      }
      ]).then(function(answers) {
      	//var itemNum = parseInt(answers.buy);
      	//var quantity = answers.number;

      	connection.query("SELECT * FROM products WHERE ?",  {id: answers.buy}, function(err, res) {
           if (err) throw err;
           		   console.log("Please see how many are left in stock below.");
                   //console.log(res);

                   if ((res[0].stock_quantity) < answers.number){
                   	console.log("Insufficent Quantity, please choose a different number, redirecting to storefront.");
                   	customerQuestions();
                   }

                   else{
                   	var price = (res[0].price);
                   	console.log(price);
                   	var newQuantity = (res[0].stock_quantity - answers.number);
                   	var total = (answers.number * price);
                   	connection.query("UPDATE products SET stock_quantity = ? WHERE  id = ? ", [newQuantity, answers.buy], function(err,res){
                   		console.log("Your total is:")
                   		console.log("$" + total);
                   		console.log("items remaining in stock:");
                   		console.log(newQuantity);

                   	})

                   }
             // we need to subtract the quantity variable from stock_quantity, have it update in mysql, and then console log remaining items

        })
	  })

  }
  }
  customerQuestions();
//SELECT stock_quantity FROM bamazon_db.products WHERE id =?