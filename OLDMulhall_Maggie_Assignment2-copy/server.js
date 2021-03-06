//Krizel Tomines & Maggie Mulhall
//Author: Kazman/Port & WODS & Labs
var express = require('express'); //code for server
var qs = require('querystring');
var app = express();
var fs = require('fs');
var queryString=require("query-string");
var myParser = require("body-parser");
var filename = "./user_data.json";

app.use(express.urlencoded({ extended: true })); //decode URL encoded data from POST requests

// handles request for any static files
app.use(express.static('./public'));

/* for index & invoice */

app.get("/index", function (request, response) {
    var contents = fs.readFileSync('./views/index.html', 'utf8'); //reads index file & saves contents in it 
    response.send(eval('`' + body + '`')); // render template string

    //author: nate moylan; 
    //this function creates a for loop to generate the products for the page
    function display_products() {
        str = '';
        // loop to generate the products
        for (i = 0; i < products.length; i++) {
            str += `
            <section class ="item">
            <h2>${products[i].brand}</h2> 
            <h3 label id ="quantity_available${i}"><i>Available: ${products[i].quantity_available} in stock!</i></h3></label>
            <h4>$${products[i].price.toFixed(2)}</h4>
            <img src="./images/${products[i].image}" class="img">
            <label id ="quantity${i}_label">Number of Items: </label>
            <input type="text" placeholder="0" name="quantity${i}" onkeyup="checkQuantityTextbox(this);"> 
            </section>`;

            // makes sure the quantity inputted by the user is validated. 
            if (typeof req.query['purchase_submit'] != 'undefined') {
                for (i = 0; i < products.length; i++) {
                    if (params.has(`quantity${i}`)) {
                        a_qty = params.get(`quantity${i}`);
                        // make textboxes sticky in case of invalid data
                        product_selection_form[`quantity${i}`].value = a_qty;
                        total_qty += a_qty;
                        if (!isNonNegInteger(a_qty)) {
                            has_errors = true; // if invalid quantity
                            checkQuantityTextbox(product_selection_form[`quantity${i}`]); // shows where the error is
                        }
                    }
                }

                console.log(Date.now() + ': Purchase made from ip ' + req.ip + ' data: ' + JSON.stringify(req.query)); //log purchase quantities
            }
            next();
        }

        return str;
    }
});

// to validate that an input value = a non negative integer
// inputstring is the input string; returnErrors indicates how the function returns
// true = return the array, false = return a boolean.    
function isNonNegInteger(inputstring, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(inputstring) != inputstring) {
        errors.push('Not a number!'); // this is to check if string = a number value
    }
    else {
        if (inputstring < 0) errors.push('Negative value!'); // to check if it is non-negative
        if (parseInt(inputstring) != inputstring) errors.push('Not an integer!'); // to check that it's an integer
        if (inputstring > 9) errors.push('Sorry, We Are Out. We Will Make More Soon');

    }

    return returnErrors ? errors : (errors.length == 0);
}
// routing
// to monitor all process requests    
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.post('/process_invoice', function (request, response, next) {
    //to validate data
    // error bag
    var orders = request.body;
    var string_orders= new URLSearchParams(orders);
    var founderror=false;
    for (i in orders){
        if (isNonNegInteger(orders['quantity' + i])==false) {
            founderror=true;
        }
        if (founderror==true){
            response.redirect("login.html?"+string_orders);
    }
    else {
        response.redirect("index.html");
    }
}

//if the data is valid, send them to the invoice, otherwise send them back to index
var errors={};

/*if(Object.keys(errors).length == 0) {
    response.redirect('./invoice.html?'+ qs.stringify(request.body)); //move to invoice page if no errors
}else{
    response.redirect('./index?'+ qs.stringify(request.body));
}*/
});
//Author: Lab14; Kazman
//checks if login is valid
if (fs.existsSync(filename)) {
    data = fs.readFileSync(filename, 'utf-8');

    user_data = JSON.parse(data); //if parser makes imported data readable json
    console.log("User_data=", user_data);

    fileStats = fs.statSync(filename);
    console.log("File " + filename + " has " + fileStats.size + " characters");
} else {
    console.log("Enter the correct filename bozo!");
}

username = 'newuser';
user_data[username] = {};
user_data[username].password = 'newpass';
user_data[username].email = 'newuser@user.com';

//if login is valid, bring them to invoice; from Lab 14 Ex3.js
//NEED TO FIX; trying to have login button request contents of user.json

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log("Got a POST to login");
    POST = request.body;

    user_name = POST["username"];
    user_pass = POST["password"];
    console.log("User name=" + user_name + " password=" + user_pass);

    if (user_data[user_name] != undefined) {
        if (user_data[user_name].password == user_pass) {
            // trying to redirect to invoice
            var orders = request.body;
            var string_orders= new URLSearchParams(orders);
            response.redirect('./invoice.html?'+ string_orders); 
            return;
        } else {
            // Bad login, redirect; if username & pass don't match
            response.send("Your login is not correct!");
        }
    } else {
        // not even username
        response.send("Register or enter again please!");
    }
});



//save orders to varible called params

app.post("process_invoice", function(request, response){
    var orders = request.body;
    var string_orders= new URLSearchParams(orders);
    response.send("invoice.html?"+ string_orders);
});

app.listen(8080, () => console.log(`listening on port 8080`));