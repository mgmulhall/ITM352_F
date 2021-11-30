var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
var data = require('./product_data.js');
var products = data.products;

app.all('*', function (request, response, next){
    console.log(request.method + 'to' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request,response){
    //process_quantity_form(request.body, response);
    response.send(request.body);
});

app.use(express.static('./public'));

// Route to handle any request; also calls next
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path: ' + request.path);
    next();
});

// Route to handle just the path /test
app.get('/test', function (request, response, next) {
    response.send('Got a GET request to path: test');
});

app.use(myParser.urlencoded({ extended: true }));

// Rule to handle process_form request from order_page.html
/*app.post("/process_form", function (request, response) {
    let POST = request.body;
    let type = products[0]['type'];
    let type_price = products[0]['price'];

    if (typeof POST['quantity_textbox'] != 'undefined') {
        let quantity = POST['quantity_textbox'];
        if (isNonNegativeInteger(quantity)) {
            products[0]['total_sold'] += Number(quantity);
            response.send(`<H2>Thank you for ordering ${quantity} ${type}! Your total is \$${quantity * type_price}.</H2>`);
        } else {
            response.send(`<I>${quantity} is not a valid quantity!</I>`);
        }
    }
});*/

// Handle request for any static file
app.use(express.static('./public'));

//app.listen(8080,()=> console.log(`listening on port 8080`));