

//Krizel Tomines & Maggie Mulhall
//Author: Kazman/Port & WODS & Labs
var express = require('express'); //code for server
var qs = require('querystring');
var app = express();
var fs = require('fs');
var queryString=require("query-string");
var myParser = require("body-parser");
var userdatafile = './user_data.json';
var filedata = 'user_data.json';
var userdata = JSON.parse(fs.readFileSync(userdatafile,'utf-8'));


if (fs.existsSync(filedata)) {
    var filestats = fs.statSync(filedata); // gets the stats from the file
    var userdata = JSON.parse(fs.readFileSync(userdatafile,'utf-8'));
    console.log(`${userdatafile} has ${filestats["size"]} characters`); // outputs the characters of the data file
} else {
    console.log(`${userdatafile} does not exist :(`)
}

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
            <h3 label id ="quantities${i}"><i>Available: ${products[i].quantities} in stock!</i></h3></label>
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

var string_orders ="";
//brin data from store page to login
app.post('/process_invoice', function (request, response, next) {
    //to validate data
    // error bag
    var orders = request.body;
    console.log(orders);
    string_orders= new URLSearchParams(orders);
    console.log(string_orders);
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
    var errors = {};

    //if the data is valid, send them to the invoice, otherwise send them back to index
    if (Object.keys(errors).length == 0) {
        response.redirect('./invoice.html?' + qs.stringify(request.body)); //move to invoice page if no errors
    } else {
        response.redirect('./index?' + qs.stringify(request.body));
    }
});



//if login is valid, bring them to invoice; from Lab 14 Ex3.js
//NEED TO FIX; trying to have login button request contents of user.json
app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log("Got a POST to login");
    POST = request.body;

    user_name = POST["username"];
    user_pass = POST["password"];
    console.log("User name=" + user_name + " password=" + user_pass);

    if (userdata[user_name] != undefined) {
        if (userdata[user_name].password == user_pass) {
            // redirect to invoice
            console.log(string_orders);
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

// registration page
app.post('/process_register', function(req, res) {
    // add a new user to the data base
    console.log(req.body);
    // Referenced some code from Lab 14 and friend
    var errors = [];


    if (/^[A-Za-z]+$/.test(req.body.name)){ // only allow to have letters in the name
    } 
    else {
        errors.push('ONLY LETTERS')
    }
    if (req.body.name== "") { // validate name
        errors.push('INVALID FULL NAME');
    }
    if (req.body.fullname.length > 25 && req.body.fullname.length < 0) { // length of the full name is between 0 and 25
        errors.push ('NAME TOO LONG')
    }
    
    var registereduser = req.body.username.toLowerCase(); // checks the new username 
    if (typeof userdata[registereduser] !='undefined') { // error message if the username is taken
        errors.push ('USERNAME TAKEN')
    }
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) { // username is in number and letters
    } 
    else {
        errors.push('ONLY LETTERS AND NUMBERS FOR USERNAME!')
    }

    if(req.body.password.length < 6) { // password needs to be less than 6 characters
        errors.push('PASSWORD IS TOO SHORT!')
    }
    if (req.body.password != req.body.repeatpassword){ // checks if both passwords match
        errors.push('PASSWORDS DO NOT MATCH!')
    }
    console.log(req.body);
// Referenced and modified from Lab14
    // make form sticky
    req.query["fullname"] = req.query["fullname"];
    req.query["username"] = req.query["username"];
    req.query["email"] = req.query["email"];
    if (errors.length == 0) {
        console.log ('NO ERRORS!');
        var username = req.body["username"];
        userdata[username] = {};
        userdata[username]["name"] = req.body["fullname"];
        userdata[username]["password"] = req.body["password"];
        userdata[username]["email"] = req.body["email"];
        data = JSON.stringify(userdata);
        fs.writeFileSync(filedata, data,"utf-8");
        res.redirect('./invoice.html?' + string_orders);
    }
});


app.listen(8080, () => console.log(`listening on port 8080`));