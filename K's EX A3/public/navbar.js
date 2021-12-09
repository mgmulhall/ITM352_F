// Borrowed and modified code from Noah Kim's Assignment2
function loadJSON(service, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('POST', service, false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}


function navbar() {
    var cart_qty;
    loadJSON('./cart_qty', function (response) {
        // Parsing JSON string into object
        cart_qty = JSON.parse(response);
    });

    document.write(`
    <ul>
        <li><a href="./products_display.html?product_key=Krave%20Beauty"><img src="images/logo.png" width="10%" height="auto" style="padding:10px"></a></li><br>
        <li><a href="./invoice.html${location.search}">Check Out-(${cart_qty.qty})In Cart</a></li>
        <li><a href="./login.html${location.search}">Login</a></li>
        <li><a href="./register.html${location.search}">Registration</a></li>
        <li><a href="./logout">Logout</a></li><br>
       
    `);
    for (let product_key in allproducts) {
        if (product_key == this_product_key) continue; // if product key that currently at is there, continue
        document.write(`<li><a href='./products_display.html?product_key=${product_key}'>${product_key}</a></li>`);
    }
    document.write(`
    </ul>
    `);
}