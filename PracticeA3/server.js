//WORKNG EMAIL



// Author: Krizel T and Maggie M //
// Date: 12/08/2021 //
// This is our server // 
// Borrowed and modified code from our Assignmnet 2, Lab 13, 14, 15 + Alyssa Mencel Assignment 2 and Noah Kim
var products = require('./products.json'); // set variable of products from product data to products
var express = require('express');  // load in express mode 
var app = express();
var myParser = require("body-parser"); //get access to POST and GET data
app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json());
var qs = require('qs');
var fs = require('fs'); // Built in module, load in fs package to use
var session = require('express-session');  // to use express node 
app.use(session({ secret: "MySecretKey" })); // intializes sessions; from Lab 15
var cookieParser = require('cookie-parser'); // enables cookies
app.use(cookieParser()); // calls cookies
const nodemailer = require("nodemailer"); // enable to sent emial 
const url = require('url'); 
const { count } = require('console');

// ALLOWS USERDATA FILE TO BE READ //
var user_data_file = './user_data.json'; // Load in user data
if (fs.existsSync(user_data_file)) { // Check to see if file exists
    var file_stats = fs.statSync(user_data_file);
    var user_data = JSON.parse(fs.readFileSync(user_data_file, 'utf-8')); // return string, parse into object, set object value to user_data
}
else {
    console.log(`${user_data_file} does not exist!`);
}

// ACTS AS UNIVERSAL APP.GET //
app.all('*', function (request, response, next) { //universal app.get
    if (typeof request.session.cart == "undefined") {
        request.session.cart = {}; // creates sessions for shopping cart
    }
    next();
});

// RETRIEVES PRODUCT DATA FROM JSON //
app.post("/get_products_data", function (request, response, next) {
    response.json(products);
});

// ALLOWS LOGIN FORM TO BE PROCESSED //
// Borrowed and modified code from our Assignment 2 & Alyssa Mencel 
app.post('/process_login', function (request, response, next) {
    // For username & password, deletes error from query after fixed 
    delete request.query.username_error; 
    delete request.query.password_error; 
    username = request.body.username.toLowerCase(); // makes sure username is all lowercase
    if (typeof user_data[username] != 'undefined') { // checks if username is registered in user_data.json & correct
        if (user_data[username].password == request.body.psw) { // check if password is registered in user_data.json & correct
            request.query.name = user_data[username].name; // personalization; retrieves name associated with username
            request.query.email = user_data[username].email; // retrieves email associated with username
            response_string = 
            // personalization after successful login
            //line 59: after successful login alert
            //line 61: after successful login redirect to invoice.html
            `<script> 
            alert('${user_data[username].name} Login Successful!'); 
            location.href = "${'./invoice.html?' + qs.stringify(request.query)}"; 
            </script>`;
            var user_info = {"username": username, "name": user_data[username].name, "email": user_data[username].email};
            response.cookie('user_info', JSON.stringify(user_info), { maxAge: 30 * 60 * 1000 }); //EXTRA CREDIT; expires session after 30 minutes
            response.send(response_string);//redirect to invoice.html with username info & products query-string, if no errors 
            return;
        } else { //Send error alert if password is invalid
            request.query.username = username;
            request.query.name = user_data[username].name;
            request.query.password_error = 'Thats Not a Correct Password! :( ';
        }
    } else { //Send error alert if username is invalid
        request.query.username = username;
        request.query.username_error = 'Thats Not a Correct Username! :(';
    }
    response.redirect('./login.html?' + qs.stringify(request.query)); // make user login again, if errors
});


// REGISTRATION FORM //
app.post('/process_register', function (request, response, next) {
    var errors = [];

    // VALIDATES FULL NAME //
    // full name only validates letters characters
    if (/^[A-Za-z]+ [A-Za-z]+$/.test(request.body.fullname) == false) {
        errors.push('Only letter characters allowed for Full Name')
    }
    // full name character length must be less than 30 
    if ((request.body.fullname.length > 30 || request.body.fullname.length < 1)) {
        errors.push('Full Name must contain Maximum 30 Characters!')
    }

    // VALIDATES USERNAME //
    // allows username to be case insensitive
    username = request.body.username.toLowerCase();
    // check if username is already registered, display error
    if (typeof user_data[username] != 'undefined') {
        errors.push('This username is taken already, get creative!');
    }
    // only allows username to have letters & numbers
    if (/^[0-9a-zA-Z]+$/.test(request.body.username) == false) {
        errors.push('Only Letters And Numbers Allowed for Username!');
    }
    // minimum username character length is minimum of 3 & maximum of 12
    if ((request.body.username.length > 12 || request.body.username.length < 3)) {
        errors.push('Username must have a minimum of 3 characters & a maximum of 12 characters!')
    }

    // VALIDATES EMAIL //
    // got code from W3spoint.com
    // Email only allows certain character for x@y.z
    if (/[A-Za-z0-9._]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(request.body.email) == false) {
        errors.push('Must enter a valid email!');
    }

    // VALIDATES PASSWORD //
    // Makes password be a minumum 6 characters 
    if (request.body.password.length < 6) {
        errors.push('A strong password is at least 6 characters!')
    }
    
    // CONFIRMS PASSWORD //
    // makes sure passwords are equal
    if (request.body.password !== request.body.repeat_password) {
        errors.push('Passwords Do Not Match')
    }

    // Borrowed some code from Lab 14 // 
    // If there are no errors, save info to user data
    if (errors.length == 0) {
        POST = request.body
        var username = POST['username']
        user_data[username] = {}; // Register it as user's information
        user_data[username].name = request.body.fullname; // POST user's name
        user_data[username].password = request.body.password; // POST user's password
        user_data[username].email = request.body.email; // POST user's email
        data = JSON.stringify(user_data);
        fs.writeFileSync(user_data_file, data, "utf-8"); // Add new user to user data json file
        request.query.name = user_data[username].name;
        request.query.email = user_data[username].email;
        response_string = `<script>alert('${user_data[username].name} Registration Successful!');
        location.href = "${'./invoice.html?' + qs.stringify(request.query)}";
        </script>`;
        var user_info = {"username": username, "name": user_data[username].name, "email": user_data[username].email};
        response.cookie('user_info', JSON.stringify(user_info), { maxAge: 30 * 60 * 1000 });
        response.send(response_string);
        // If no errors, send window alert success
    }
    // If there are errors redirect to registration page & keep info in query string
    if (errors.length > 0) {
        request.query.fullname = request.body.fullname;
        request.query.username = request.body.username;
        request.query.email = request.body.email;
        // Add errors to query string
        request.query.errors = errors.join(';');
        response.redirect('register.html?' + qs.stringify(request.query));
    }
});
// ------ End Process registration form ----- //

// ------ Get cart qty ----- //
app.post('/cart_qty', function (request, response) {
    var total = 0;
    for (pkey in request.session.cart) {
        total += request.session.cart[pkey].reduce((a, b) => a + b, 0);
    }
    response.json({"qty": total});
});
// ------ Get cart qty ----- //

//--make products.json data java script---//
var products_data;
var products_data_file = './products.json';
if (fs.existsSync(products_data_file)) {
var products_data= JSON.parse(fs.readFileSync(products_data_file, 'utf-8'));
};

var a_qty;
for ( i in products_data){
    a_qty = products_data[i].quantity_available;
};
// ------ Process order from products_display ----- //
// Got help from Professor Port during office hours
app.post('/add_to_cart', function (request, response) {
    let POST = request.body; // create variable for the data entered into products_display
    var qty = POST["prod_qty"];
    var ptype = POST["prod_type"];
    var pindex = POST["prod_index"];
    //if the entered quantity passes non negative integer validation and is not 0, and theres enough in stock, add to cart. If no, tell user Invalid
    if (isNonNegInt(qty) && qty!=0) {
        // Add qty data to cart session
        if (typeof request.session.cart[ptype] == "undefined") {
            request.session.cart[ptype] = [];
        }
        request.session.cart[ptype][pindex] = parseInt(qty);
        response.json({ "status": "Successfully Added to Cart, Please refresh browser to display number of items in cart." });
    } if(qty > a_qty){
        response.json({ "status": "Not Enough In Stock, Not added to cart" });
    } else{
        response.json({ "status": "Invalid quantity, Not added to cart. Please ensure you are ordering at least one item and not more than what is in stock." });
    }
});
// ------ End Process order from products_display ----- //

// ------ Get info from session (shopping cart data) ----- //
app.post('/get_cart', function (request, response) {
    response.json(request.session.cart);
});
// ------ Get info from session (shopping cart data) ----- //

// ------ Update session info/shopping cart with new quantities ----- //
app.post("/update_cart", function (request,response) {
    // replace cart in session with post
    // check if updated quantities are valid
    let haserrors = false;
    for (let ptype in request.body.quantities) {
        for (let i in request.body.quantities[ptype]) {
            qty = request.body.quantities[ptype][i];
            haserrors = !isNonNegInt(qty) || haserrors; // Flag -> once haserrors true, always true
        };
    };
    if (haserrors == true) { // if there are errors, send error msg
        msg = "Invalid quantities. Cart not updated";
    } else { // if there are no errors, update cart
        msg = "Cart successfully updated!";
        request.session.cart = request.body.quantities;
    }
    const ref_URL = new URL(request.get('Referrer'));
    ref_URL.searchParams.set("msg", msg); // get qs and add to qs
    response.redirect(ref_URL.toString());
});
// ------ End update session info/shopping cart with new quantities ----- //

// ------ User Logout ----- //
app.get("/logout" , function (request, response) {
    var user_info = JSON.parse(request.cookies["user_info"]);
    var username = user_info["username"];
    logout_msg = `<script>alert('${user_info.name} has successfully logged out!'); location.href="./index.html";</script>`;
    response.clearCookie('user_info');
    response.send(logout_msg);
});
// ------ User Logout ----- //

// ------ Complete purchase -> email invoice ----- //
app.post('/completePurchase', function (request, response) {
    var invoice = request.body;
    var user_info = JSON.parse(request.cookies["user_info"]);
    var the_email = user_info["email"];
    var transporter = nodemailer.createTransport({
        host: "mail.hawaii.edu",
        port: 25,
        secure: false, // use TLS
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        from: 'mgmulhall@hawaii.edu',
        to: the_email,
        subject: 'Thanks For Purchasing from Krizel and Maggie Boba!',
        html: invoice.invoicehtml
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            status_str = 'There was an error and your invoice could not be emailed :(';
        } else {
            status_str = `Your invoice was mailed to ${the_email}`;
        }
        response.json({ "status": status_str});
    });
    request.send.destroy();
});
// ------ Complete purchase -> email invoice ----- //

// Function to check if value isNonNegInt
// Borrowed function from Assignment 1
function isNonNegInt(q, return_errors = false) { // Checks if the values input are a positive integer
    errors = []; // Initially assumes there are no errors
    if (q == '' || q == null) q = 0; // If the input is "blank" or null, set the value to 0 
    if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value. If not, send error with reason.
    else if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if string is non-negative. If not, send error with reason.
    else if (parseInt(q) != q) errors.push('<font color="red">Not an integer</font>'); // Check that it is an integer. If not, send error with reason.
    return return_errors ? errors : (errors.length == 0);
}

app.use(express.static('./public'));

var listener = app.listen(8080, () => { console.log('server started listening on port ' + listener.address().port) });