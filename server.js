//Krizel Tomines 
//Author: Kazman/Port & WODS & Labs
import {createServer} from 'http';
import {parse} from 'url';
import {join} from 'path';
import {writeFile, readFileSync, existsSync, fstat} from 'fs';


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


let user_data;
if (existsSync("user_data.json")) {
    user_data = JSON.parse(readFileSync("user_data.json"));
} else {
    user_data = {
        "username": {
            name:"",
            password:"",
            email:""}
    };
}

createServer(async (req, res) => {
    const parsed = parse(req.url, true);

    if (parsed.pathname === '/register') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            user_data.username.push({
                name: data.name,
                password: data.password,
                email: data.email
            });
            
            writeFile("user_data.json", JSON.stringify(user_data), err => {
                if (err) {
                    console.err(err);
                } else res.end();
            });
        });
    } else {
        // If the client did not request an API endpoint, we assume we need to fetch a file.
        // This is terrible security-wise, since we don't check the file requested is in the same directory.
        // This will do for our purposes.
        const filename = parsed.pathname === '/' ? "1index.html" : parsed.pathname.replace('/', '');
        if (existsSync(path)) {
            if (filename.endsWith("html")) {
                res.writeHead(200, {"Content-Type" : "text/html"});
            } else if (filename.endsWith("css")) {
                res.writeHead(200, {"Content-Type" : "text/css"});
            } else if (filename.endsWith("js")) {
                res.writeHead(200, {"Content-Type" : "text/javascript"});
            } else {
                res.writeHead(200);
            }
 
            res.write(readFileSync(path));
            res.end();
        } else {
            res.writeHead(404);
            res.end();
        }
    }
}).listen(8080);






app.use(express.urlencoded({ extended: true })); //allow a post request from URL to save data to request body.
