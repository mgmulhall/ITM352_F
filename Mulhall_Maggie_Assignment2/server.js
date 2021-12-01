
/* 
 * Author: Krizel Tomines; November 29th, 2021
 * Server to display products, validate pruchases, & display an invoice for the user
 */
var express = require('express'); //code for server
var qs = require('querystring');
var app = express();
var querystring = require("query-string");

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
    var errors = {};

    // will create a login page 
    var users_reg_data =
    {
        "dport": { "password": "portpass" },
        "kazman": { "password": "kazpass" }
    };

    app.use(express.urlencoded({ extended: true }));

    app.get("/login", function (request, response) {

        // Creates a login form for user
        //Author: Kazman/ Port; Example from 352 Module 
        str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
        response.send(str);
    });

    app.post("/login", function (request, response) {
        // Process login form POST and redirect to logged in page if ok, back to login page if not
        the_username = request.body['username'].toLowerCase();
        the_password = request.body['password'];
        if (typeof users_reg_data[the_username] != 'undefined') {
            if (users_reg_data[the_username].password == the_password) {
                response.send(`User ${the_username} is logged in`);
            } else {
                response.send(`Wrong password!`);
            }
            return;
        }
        response.send(`${the_username} does not exist`);
    });


    //author: Kazman & Maggie M.; sends user login page, if accepted will go to invoice
    //sends response
    app.post("/process_form", function (request, response)
    {
    request_post = request.body;
    values_okay = true;
    for (i in request.post) {
        elem = request_post["quantity" + i];
        if (isNonNegInt(elem) != true) {
            values_okay = false; 
        }
    }
    if (values_okay == true) {
        //redirects user to invoice
        querystring = ""; //records info we need to share that needs to be passed
        //need for loop that builds query string
        response.redirect("/invoice.html" +"?"+ querystring); //need a var & build query string in for loop
            //(request.body, response);
       for (i in request.post);
       
       
    }
});





//if the data is valid, send them to the invoice, otherwise send them back to index
if (Object.keys(errors).length == 0) {
    response.redirect('./invoice.html?' + qs.stringify(request.body)); //move to invoice page if no errors
} else {
    response.redirect('./index?' + qs.stringify(request.body));
}
});



// handles request for any static files
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));
