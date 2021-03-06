//Krizel Tomines & Maggie Mulhall
//Author: Kazman/Port & WODS & Labs
var express = require('express'); //code for server
var qs = require('querystring');
var app = express();
var fs = require('fs');
var queryString=require("query-string");
var myParser = require("body-parser");
var filename = "./user_data.json";
var data = require("./products.js");
var products = data.products

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


//bring data from store page to login
//adapted from Toni Libara
app.post('/process_invoice', function (request, response, next) {
    let POST = request.body; // create a variable
    console.log(POST);
    if(typeof POST ['purchasebutton'] !='undefined') {
        var validquantities = true; // assumes the values are true and has valid quantities
        var hasquantities = false
        for (i=0; i < products.length; i++) {

            qty = POST [`quantity${i}`];
            hasquantities = hasquantities || qty > 0; // valid if the value is > 0
            validquantities = validquantities && isNonNegInt(qty); // if they are both valid and >0
        }

    const stringified = qs.stringify(POST); // generate invoice if all the quantities are valid
    if (validquantities && hasquantities) {
        response.redirect("./login.html?" + stringified); // direct to login page with the query string of the order quantities
    } else {
        response.redirect("./index.html?" + stringified)
        }
    }
});
    
//Define vairable new_sting_orders out side of process invoice function to make it global
//var new_string_orders = JSON.stringify(request.body["quantity"]);


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

//if login is valid, bring them to invoice; from Lab 14 Ex3.js

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log("Got a POST to login");
    POST = request.body;

    user_name = POST["username"];
    user_pass = POST["password"];
    console.log("User name=" + user_name + " password=" + user_pass);

    if (user_data[user_name] != undefined) {
        if (user_data[user_name].password == user_pass) {
            // redirect to invoice
            response.redirect('./invoice.html?'+new_string_orders); 
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


//save registration data and add it to user_data.json
app.post("./register", function (request, response) {
    var new_errors = {};

    /* Process a simple register form */
    /* Make it so capitalization is irrelevant for usernames */
    var new_username = request.body['username'].toLowerCase();

    /* Require only letters to be used for usernames */
    if (/^[A-Za-z]{4,10}$/.test(request.body.username) == false) {
       new_errors['username'] = 'only letters in your username. '
    }

    // Require a specific email format 
    if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(request.body.email) == false) {
        new_errors['email'] = 'Please enter a valid email address'
    }

    //Require a unique username 
    if (typeof user_data[new_username] != 'undefined') {
        new_errors['username'] = 'Username is already taken.'
    }

    /* Require a minimum of 4 characters and no more than 10 */
    if(request.body.password.length < 6) {
        new_errors['password'] = 'You must enter a minimum of 6 characters.'
    }

    /* Confirm that both passwords were entered correctly */
    if(request.body.password !== request.body.repeat_password) {
        new_errors['repeat_password'] = 'Both passwords must match'
    }

    /* If new_errors is empty */
    if (JSON.stringify(new_errors) == '{}') {
        /* Write data into user_data.json and send to invoice.html */
        user_data[new_username] = {};
        user_data[new_username].name = request.body.name;
        user_data[new_username].password = request.body.password;
        user_data[new_username].email = request.body.email;

        /* Writes user information into file */
        fs.writeFileSync(filename, JSON.stringify(user_data));

        /* Add username and email to query */
        request.query['username'] = request.body.username;
        request.query['email'] = user_data[new_username].email;
        response.redirect('./invoice.html?' + qs.stringify(request.query));
        return;
    }
    else {
        /* Put errors and registration data into query */
        request.query['reg_errors'] = JSON.stringify(new_errors);
        request.query['reg_data'] = JSON.stringify(request.body);
        response.redirect(`./register.html?` + qs.stringify(request.query));
    }
});


app.listen(8080, () => console.log(`listening on port 8080`));