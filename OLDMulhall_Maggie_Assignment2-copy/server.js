//Krizel Tomines 
//Author: Kazman/Port & WODS & Labs

var express = require('express'); //code for server
var qs = require('querystring');
var app = express();
var myParser= require("body-parser");
var fs = require('fs');
var queryString=require("query-string");


app.use(express.urlencoded({ extended: true })); //decode URL encoded data from POST requests
app.get("/index", function (request, response) {
    var contents = fs.readFileSync('./views/index.html', 'utf8');
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
                        if (!isNonNegInt(a_qty)) {
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
function isNonNegInt(inputstring, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(inputstring) != inputstring) {
        errors.push('Not a number!'); // this is to check if string = a number value
    }
    else {
        if (inputstring < 0) errors.push('Negative value!'); // to check if it is non-negative
        if (parseInt(inputstring) != inputstring) errors.push('Not an integer!'); // to check that it's an integer
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
//error bag
var errors={};


//if the data is valid, send them to the invoice, otherwise send them back to index
if(Object.keys(errors).length == 0) {
    response.redirect('./invoice.html?'+ qs.stringify(request.body)); //move to invoice page if no errors
}else{
    response.redirect('./index?'+ qs.stringify(request.body));
}
});

//save inputted user name data to user_data.js
//adapted from File I/O screencast and lab 14 Ex4
var data = require('./user_data.json');
var filename = "user_data.json"

const { response } = require('express');

//serves as get requests
/*app.all('*', function (require, response, next) { // Links to my request POST
    console.log(require.method + ' to ' + require.path); // Write the request method in the console and path
    next(); // Continue
});*/
//if the file exists, read it and store contents in variable data
if (fs.existsSync(filename)) {
    data = fs.readFileSync(filename, 'utf-8');
//make data javascript (parse it) into varible user_data
    user_data = JSON.parse(data);
    console.log("User_data=", user_data);

    fileStats = fs.statSync(filename);
    console.log("File " + filename + " has " + fileStats.size + " characters");
} else {
    console.log(filename+"is not a file");
}

app.use(express.urlencoded({ extended: true })); //allow a post request from URL to save data to request body.

app.get("/login", function(request, response){
    //this simple log in form needs to be my login.html
    str =`<body>
    <form action"/login" method="POST">
    <input type = "text" name ="" placeholder= "Username" required><br />
    <input type= "password" name="" placeholder= "Password" required><br />
    <button type="submit" class="btn">Login</button>
    </form>
    </body> 
    `;
    response.send(str)
});

app.post("/login", function (request, response){
    console.log("Got a POST to login");
    POST = request.body;

    user_name = POST["username"];
    user_pass = POST["password"];
    console.log("User name="+ user_name + " Password="+ user_pass);
    if (user_data[user_name] != undefined) {
        if (user_data[user_name].password == user_pass){
            response.redirect("invoice.html");
        } else {
            response.send("Invalid Login");
        }
    } else {
        response.send("Bad Username");
    }

});


/* for registration; author: reece nagaoka */
 /* wont work !!!*/
 app.post("./register", function (request, response) {
    var new_errors = {};

     /* Process a simple register form */
    /* Make it so capitalization is irrelevant for usernames */
    var new_username = request.body['username'].toLowerCase();


    // Requires usernames to be letters and numbers 
    if (/^[0-9a-zA-Z]+$/.test(request.body.username)) {
     }
    else {
    errors.push('Letters And Numbers Only for Username')
     }

    /* Require a unique username */
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
        /* Write data and send to invoice.html */
        user_data[new_username] = {};
        user_data[new_username].name = request.body.name;
        user_data[new_username].password = request.body.password;
        user_data[new_username].email = request.body.email;

        /* Writes user information into file */
        fs.writeFileSync(filename, JSON.stringify(user_data));


    /* Require a specific email format */
    if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(request.body.email) == false) {
        new_errors['email'] = 'Please enter a valid email address'
    }
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

// handles request for any static files
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//create file
//fs.writeFileSync(filename, user_data, "utf-8");

// add new inputted user data to user_data.json
//fs.appendFileSync(filename, data, "utf-8");

// handles request for any static files
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));