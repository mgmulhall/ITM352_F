var express = require('express');
var app = express();
var myParser = require("body-parser");
//var fs = require('fs');
var data = require('./public/product_data.js');
const querystring = require('qs');
var products = data.products;

//connect server to all files in directory 
app.all('*', function (request, response, next){
    console.log(request.method + 'to' + request.path);
    next();
});

// Handle request for any file in public
app.use(express.static('./public'));
//validation

//check that there is a value in the text box on index
function checkQuantityTextbox(theTextbox) {
    errors = isNonNegInt(theTextbox.value, true);
    if (errors.length == 0) errors = ['You want:']; //if there are no errors, "You want:*requested amount*
    if (theTextbox.value.trim() == '') errors = ['Please type quantity desired: '];// if there are no requested amounts, ask for amount
}  
// check if the value entered if valid and in stock
function isNonNegInt(inputstring, returnErrors = false) {
    errors = []; // assume no errors at first
    numberstring=Number(inputstring);
    if(numberstring != inputstring) {
        errors.push('<font color="red">Not a Number!</font>'); // Check if string is a number, if not say "Not a number!"
    }
    else
    {
        if (numberstring ==0) errors.push('<font color="red">You Need More Than That!</font>');
        if(numberstring < 0) errors.push('<font color="red">Negative Value!</font>'); // Check if it is non-negative, if not say "Negative value!"
        if(parseInt(inputstring) != inputstring) errors.push('<font color="red">Not an integer!</font>'); // Check that it is an integer, if not say "Not an integer!"
        if (numberstring > products[i].quantity_availaible) errors.push('<font color="red">Not Enough In Stock!</font>'); // check if the requested amount is in stock
    }          
    return returnErrors ? errors : (errors.length == 0); // if there are no errors , errors.length ==0, proceed to next validation
}

app.use(myParser.urlencoded({ extended: true }));

// if there are no errors, display inovice table when you click purchase
//function check_out(){
//if (errors.length = 0) 
app.post("/process_form", function (request, response){
    request_post=request.body;
    values_okay= true;
    //if the elements in request body dont pass the non neg int test, values are not okay
    for (i in request_post){
        elem = request_post["quantity"+i];
        if (isNonNegInt(elem)!=true){
            values_okay=false;
        }
    }
    if (values_okay==true){
        //add values to querysting
        querystring = "";
        for(i in request.post){
            querystring.concat(i)
        };
        response.redirect("/invoice.html" +"?"+querystring);
    }
});
//display_invoice_table_rows(request.body, response);;


//loop for invoice table if input passed both validations
function display_invoice_table_rows(inputstring) {
    inputstring= a_qty; 
    subtotal = 0;
    str = '';
        if (a_qty != undefined) {// if the requested quantity is valid
            extended_price =a_qty * products[i].price //multiply the price by quantity and make it the extended price
            subtotal += extended_price; // subtotal is added to and is now extended price
        //make actual table
            str += (`
  <tr>
    <td width="43%">${products[i].item}</td>
    <td align="center" width="11%">${a_qty}</td>
    <td width="13%">\$${products[i].price}</td>
    <td width="54%">\$${extended_price}</td>
  </tr>
  `);
        }
    };

app.listen(8080,()=> console.log(`listening on port 8080`));