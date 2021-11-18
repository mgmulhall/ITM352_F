// code adapted from template given in assignmnet 1 instructions.
 
//Routing
 
    //require the use of express to start server
    var express = require('express');
    var myParser = require("body-parser");
     
        //require file system module, learned from w3 schools/class
    var fs = require('fs');
     
      //get product data from products.js file
    var products = require("./public/product_data.js");
    var app = express();
     
    // monitor all requests
    app.use(myParser.urlencoded({ extended: true}));

     
    // process purchase request
     
    // Validate the requested qantity is a non negative integer. Loop adapted from inclass labs
     
    function isNonNegInt(inputstring, returnErrors = false) {
        errors = []; // assume no errors at first
        if(Number(inputstring) != inputstring) {
            errors.push('Not a number!'); // Check if string is a number, if not say "Not a number!"
        }
        else
        {
            if(inputstring < 0) errors.push('Negative value!'); // Check if it is non-negative, if not say "Negative value!"
            if(parseInt(inputstring) != inputstring) errors.push('Not an integer!'); // Check that it is an integer, if not say "Not an integer!"
        }          
        return returnErrors ? errors : (errors.length == 0); // if there are no errors , errors.length ==0, proceed to nect validation
    }
     
    // Checks Quantity textbox for validation errors
    function checkQuantityTextbox(theTextbox) {
        errors = isNonNegInt(theTextbox.value, true);
        if (errors.length == 0) errors = ['You want:']; //if there are no errors, "You want:*requested amount*
        if (theTextbox.value.trim() == '') errors = ['Please type quantity desired: '];// if there are no requested amounts, ask for amount
        document.getElementById(theTextbox.name + '_label').innerHTML = errors.join('<font color="red">, </font>');
    }    
     
     
    // Show the sweatshirt store using GET
     app.get("/sweatshirt_store", function (request, response) {
        var contents = fs.readFileSync('./views/sweatshirt_store.html', 'utf8');
        response.send(eval('`' + body + '`')); // render template string
     
        // get product data from product_data.js and display it on the sweatshirt page
    function display_products() {
        str = ''; // start with nothing
        // loop to generate the products
        for (i = 0; i < products.length; i++) {
            str += `
            <section class ="items">
            <h2>${products[i].type}</h2>
            <h3 label id ="quantity_available${i}"><i>Only ${products[i].quantity_available} Left!</i></h3></label>
            <h4>$${products[i].price.toFixed(2)}</h4>
            <img src="./images/${products[i].image}" class="img">
            <label id ="quantity${i}_label">Number of Items: </label>
            <input type="text" placeholder="0" name="quantity${i}" onkeyup="checkQuantityTextbox(this);">
            </section>`;
     
            // Apply validation( the NonNegInt and checkQuantityTextbox functions)
            if (typeof req.query['purchase_submit'] != 'undefined') {
       
                for (i = 0; i < products.length; i++) {
                    if (params.has(`quantity${i}`)) {
                        a_qty = params.get(`quantity${i}`);
                        // make textboxes sticky in case of invalid data
                        product_selection_form[`quantity${i}`].value = a_qty;
                        total_qty += a_qty;
                        if (!isNonNegInt(a_qty)) {
                            has_errors = true; // if the inputed quantity has errors(true), say there's a problem
                            checkQuantityTextbox(product_selection_form[`quantity${i}`]); // show where the error is
                        }
                    }
                }
               
                console.log(Date.now() + ': Purchase made from ip ' + req.ip + ' data: ' + JSON.stringify(req.query));
            }
            next();
        }
       
        return str;
    }
    });
     
    app.post("/process_invoice", function (request, response, next) {
    let POST = request.body;
    if(typeof POST['purchase_submit'] == 'undefined') { // Checks if there is a quantity in the txtbox
        console.log('Nothing selected'); // Sends message to user if there is not any quantity inputed
        next();
    }
     
    console.log(Date.now() + ': Purchase made from ip ' + request.ip + ' data: ' + JSON.stringify(POST));
     
    var contents = fs.readFileSync('./public/invoice.html', 'utf8');
    response.send(eval('`' + contents + '`')); // render template string
     
    // adapted from Inoice 4 WOD by Maggie Mulhall based on Professor Port screan cast for Invoice 4
    function display_invoice_table_rows() { //loop for invoice table
        subtotal = 0;
        str = '';
        for (i = 0; i < products.length; i++) {
            a_qty = params.get(`quantity${i}`);
            if(typeof POST[`quantity${i}`] != 'undefined') { // if the quantity requested is not undefined
                a_qty = POST[`quantity${i}`];
            }
            if (a_qty > 0) {// if the requested quantity is postive
                extended_price =a_qty * products[i].price //multiply the price by quantity and make it the extended price
                subtotal += extended_price; // subtotal is added to and is now extended price
                str += (`
      <tr>
        <td width="43%">${products[i].item}</td>
        <td align="center" width="11%">${a_qty}</td>
        <td width="13%">\$${products[i].price}</td>
        <td width="54%">\$${extended_price}</td>
      </tr>
      `);
            }
        }        
     
        // Compute tax
        tax_rate = 0.0575;
        tax = tax_rate * subtotal;
     
        // Compute shipping
        if (subtotal <= 50) {
            shipping = 2;
        }
        else if (subtotal <= 100) {
            shipping = 5;
        }
        else {
            shipping = 0.05 * subtotal; // 5% of subtotal
        }
     
        // Compute grand total
        total = subtotal + tax + shipping;
       
        return str;
    }
 
});
 
app.use(express.static('./public'));
 
var listener = app.listen(8080, () => { console.log('server started listening on port ' + listener.address().port) });
