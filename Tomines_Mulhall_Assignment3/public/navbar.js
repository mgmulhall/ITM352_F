// Author: Krizel T & Maggie M
// Date: 12/8/2021
// Create navigation bar that will be at the top of the majority of the pages
// Includes links to product pages, login, shopping cart, logout and registration
// Borrowed and modified code from Noah Kim's Assignment 3

//Security
//Allows us to load user data into json file without dispalying password in URL
//Learned from https://www.sitepoint.com/community/t/how-to-access-json-file-content-via-xmlhttprequest/281547
function loadJSON(service, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('POST', service, false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

//function to call nav bar
function navbar() {
    var cart_qty;
    loadJSON('./cart_qty', function (response) {
        // Parsing JSON string into object
        cart_qty = JSON.parse(response);
        console.log(cart_qty);
    });

    document.write(`
    <ul>
        <li><a href="./products_display.html?product_key=Boba%">Home</a></li><br>
        <li><a href="./invoice.html${location.search}">Check Out: ${Number(cart_qty.qty)} In Cart</a></li>
        <li><a href="./login.html${location.search}">Login</a></li>
        <li><a href="./register.html${location.search}">Registration</a></li>
        <li><a href="./logout">Logout</a></li><br>
       
    `);
    // Allow user to click on product type in nav bar and be sent to that screen, even though its on the same products_display.html
    // Learned and heavily adapted from https://blog.devgenius.io/create-a-responsive-navigation-bar-in-html-css-and-js-4648ce90fd6c
    for (let product_key in allproducts) {
        if (product_key == this_product_key) continue; 
        document.write(`<li><a href='./products_display.html?product_key=${product_key}'>${product_key}</a></li>`);
    }
    document.write(`
    </ul>
    `);
}