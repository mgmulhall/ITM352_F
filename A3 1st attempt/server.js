// Chloe and Caixin's server.js
// Some parts are borrowed and modified by Assignement 1, Assignment 2, Lab 14, and Professor Port's sceencast.
var data = require('./public/products.js');  //loads products.js
var allProducts=data.allProducts; // declare variable 
const queryString = require('qs'); 
var express = require('express');  // load in express mode 
var app = express();
var myParser = require("body-parser");   //get access to POST and GET data 
var filename = 'user_data.json'; // set vraible 
var fs = require('fs');
const{request} = require('express'); // to use express node 
var session = require('express-session'); 
var nodemailer = require('nodemailer'); // enable to sent emial 
const { type } = require('os');
const shift = 4; //shift for encyption get helped from stackoverlow

//initialize session, from lab 15
app.use(session({secret: "MySecretKey", resave: true, saveUninitialized: true}));

app.use(myParser.urlencoded({ extended: true }));

app.use(express.static('./public'));

// link to request 
app.all('*',function(request,response,next){
    console.log(request.method + 'to' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));

//check if file exist 
if(fs.existsSync(filename)) {
    var file_stats =fs.statSync(filename);
    console.log(filename + 'has ' + file_stats.size + ' characters!');// if exist shows the size 
    data = fs.readFileSync(filename,'utf-8'); //read in the data
    user_data = JSON.parse(data);
} else {
    console.log(filename + ' does not exist!'); // if not exist shows on console.
}

//-------encrypt the password -------//
function encrypt(password){
 	var encrypted = [];
 	var encrypted_result = "";

 	//encrypt the password Referece: Stack overflow 
 	for (var i = 0; i < password.length; i++){
 		encrypted.push(password.charCodeAt(i)+shift);
 		encrypted_result += String.fromCharCode(encrypted[i]);
 	}
 	return encrypted_result;
}

//check if logged in with a username. yes: move on no: redirect them to the login
const redirectLogin = (request, response, next) => {
  if(!request.session.userName){
      response.redirect('/login.html')
  }else{
      next()
  }
}
//check if logged in, if not redirect to destination, else to display
const redirectHome = (request, response, next) => {
  if(request.session.userName){
    response.redirect('/display.html?' + 'fullname=' + request.session.userName.name)
  }else{
    next()
  }
};

//direct user to shopping cart from display if logged in
const redirectDisplay = (request, response , next) => {
  if(!request.session.cart){
    return response.redirect('/to-shoppingcart.html');
  }else{
    next()
  }
};
//----get requests for nav bar-----

//go to login
app.get('/to-login', redirectHome, function(request, response) {
  response.redirect('/login.html');
});

//go to register
app.get('/to-register', redirectHome, function(request, response) {
  response.redirect('/register.html');
});

//go to shopping cart
app.get('/to-shoppingcart', redirectLogin, function(request, response) {
  response.redirect('/shoppingcart.html');
});

//go to display.html
app.get('/to-display', redirectHome, function(request, response){
  response.redirect('/products_display.html?');
});

//go to checkout
app.get('/checkout', function(request, response){
  if(typeof request.session.cart == 'undefined' || request.session.cart.length == 0){
    response.redirect('/shoppingcart.html?error=cart is empty');
  }
  response.redirect('/checkout.html');
  
});

//to the index page
app.get('/', redirectHome, function(request, response) {
  return response.redirect('/index.html');
})

//navigate back to the display page from invoice, and clear the cart
app.get('/to-display-clear', function(request,response){
  //clear the cart
  request.session.cart = [];
  console.log(request.session.cart);
  //send them back to display
  return response.redirect('/to-display');
})


//log-out
app.get('/log-out', redirectLogin, (request, response) => {
  //end the session
  request.session.destroy();
  //send user back to products display page
  response.redirect('/products_display.html?' + "logout=You are now logged out.");
})

//post cart item to front end as json
app.post("/get_cart", function (request, response) {
  response.json(request.session.cart);
});

//post user info to front end as json
app.post("/get_user", function (request, response){
  response.json(request.session.userName);
})

//post checkout info to front end as json
app.post("/get_checkout_info", function (request, response){
  response.json(request.session.checkout_info);
})

//---add item to shopping cart, get help from Professor port----//
app.post('/add_cart',  redirectLogin, function(request,response){
  console.log(request.body);
  var count;
  var ptype = request.body['product_type'];
  var formData_name = request.body['ProductName'];
  var formData_quantity = parseInt(request.body['quantity']);
  var formData_price = parseInt(request.body['price']);

  //to store data 
  formData = {ptype: ptype, name: formData_name, price: formData_price, quantity: formData_quantity};

  var cart = request.session.cart;

  if(typeof cart == 'undefined'){
    count = 0;
  }

  //check if the quantity entered is valid
  if (isNonNegInt(formData_quantity)){

    //if cart exists
    if(cart){
      //look for the index
    var foundItemIndex = cart.findIndex((item) => {
        return item.name == formData_name;
      });
    //if the index returned in 0 or higher
    if(foundItemIndex >= 0) {
                // Aggregate cart item
                var totalQuantity = cart[foundItemIndex].quantity + formData.quantity;
                cart[foundItemIndex].quantity = totalQuantity;
                if(typeof cart != 'undefined'){
                count = request.session.cart.length;
              }

            } else { 
              //if return -1, add item to cart
              cart.push(formData);
              if(typeof cart != 'undefined'){
                count = request.session.cart.length;
              }
              
            }

  }else{
    //if cart does not exists, initialize cart and add the item to cart
    request.session.cart = [formData];
    if(typeof cart != 'undefined'){
        count = request.session.cart.length;
      }
  }
}else{
  //if error, reload page and pass error to front end
  if(typeof cart != 'undefined'){
        count = request.session.cart.length;
    }
  response.redirect(`display.html?productType=${ptype}&fullname=${request.session.userName.name}&count=${count}&errors=${errors}`);
}
  

  //if no error, reload page
  response.redirect(`display.html?productType=${ptype}&fullname=${request.session.userName.name}&count=${count}`);
});




// add one to the item in cart
app.post('/add_one', function(request, response){
  var ptype = request.body['product_type'];
  var formData_name = request.body['ProductName'];
  var formData_quantity = parseInt(request.body['add']);
  var cart = request.session.cart;

  //find the index
  var foundItemIndex = cart.findIndex((item) => {
        return item.name == formData_name;
      });
    console.log(foundItemIndex);
    
    //if the index is 0 or higher
    if(foundItemIndex >= 0){
        //increase the quantity by 1
        console.log(cart[foundItemIndex].quantity);
        var newTotal = cart[foundItemIndex].quantity + formData_quantity;
        console.log(newTotal);
        cart[foundItemIndex].quantity = newTotal;
    }



  return response.redirect("/shoppingcart.html");

});

//reduce quantity by 1 from item
app.post('/remove_one', function(request, response){
  var ptype = request.body['product_type'];
  var formData_name = request.body['ProductName'];
  var formData_quantity = parseInt(request.body['reduce']);
  var cart = request.session.cart;

  var foundItemIndex = cart.findIndex((item) => {
        return item.name == formData_name;
      });
    //console.log(foundItemIndex);
    
    //if the index is 0 or higher
    if(foundItemIndex >= 0){
        //reduce the quantity by 1
        console.log(cart[foundItemIndex].quantity);
        if(cart[foundItemIndex].quantity > 0){
          var newTotal = cart[foundItemIndex].quantity - formData_quantity;
          console.log(newTotal);
          cart[foundItemIndex].quantity = newTotal;
        }else{
          //remove the item from cart if its 0 or lower
          cart.splice(foundItemIndex, 1);
        }
        
    }

  return response.redirect("/shoppingcart.html");

});

//remove item from the cart 
app.post('/remove-from-cart', (request, response) =>{
    

    var formData_name = request.body["ProductName"];

    var cart = request.session.cart;

    //find the product index in session.cart
    var foundItemIndex = cart.findIndex((item) => {
        return item.name == formData_name;

    })
    
    
    //if the index is 0 or higher
    if(foundItemIndex >= 0){
        //remove the index
        cart.splice(foundItemIndex, 1);
    }

    return response.redirect('/shoppingcart.html');

}); 

//this processes the login form Reference: lab 14
app.post("/login", function (request, response) {
  // Process login form POST and redirect to logged in page if ok, back to login page if not
  console.log("Got a POST to login");
  POST = request.body;
  datauser=request.body

  user_name = POST["username"];
  user_pass = POST["password"];
  
  console.log("User name=" + user_name + " password=" + user_pass);

  if (user_data[user_name] != undefined) {
      if (user_data[user_name].password == user_pass) {
          // redirect to shopping cart
          response.redirect('./shoppingcart.html?'); 
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

//this processes the register form
app.post("/process_register", function (req, res) {
    qstr = req.body
    console.log(qstr);
    var errors = [];

    if (/^[A-Za-z]+$/.test(req.body.name)) { //full name on name part
    }
    else {
      errors.push('ONLY LETTERS')
    }

    if (req.body.name== "") { // validate name
        errors.push('INVALID FULL NAME');
    }

    if (req.body.fullname.length > 25 && req.body.fullname.length < 0) { // length of the full name is between 0 and 25
        errors.push ('NAME TOO LONG')
    }
  
    var reguser = req.body.username.toLowerCase(); // checks the new username and makes it lowercase
    if (typeof user_data[reguser] != 'undefined') {
      errors.push('USERNAME TAKEN')
    }
    
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) { // username is in number and letters
    }
    else {
      errors.push('ONLY LETTERS AND NUMBERS FOR USERNAME!')
    }
    
    if(req.body.password.length < 6) { // password needs to be less than 6 characters
        errors.push('PASSWORD IS TOO SHORT!')
    }
    if (req.body.password != req.body.repeatpassword){ // checks if both passwords match
        errors.push('PASSWORDS DO NOT MATCH!')
    }
   
    if (errors.length == 0) { // Save new user's register information if no error
      POST = req.body
      console.log('no errors')

      username = POST['username']

      let encrypted_pass = encrypt(req.body.password);


      user_data[username] = {}; 
      user_data[username].name = req.body.fullname;
      user_data[username].password= encrypted_pass;
      user_data[username].email = req.body.email;
      data = JSON.stringify(user_data); 
      fs.writeFileSync(filename, data, "utf-8");
      res.redirect('./login.html');
    }
    
    else{ //if error occurs, direct to register page
        console.log(errors)
        req.query.errors = errors.join(';');
        res.redirect('register.html?' + queryString.stringify(req.query));
    }
});

//check if the number is valid
function isNonNegInt(q, returnErrors = false) { //value are integer
    errors = [];  
    if (q == "") { q = 0; }
    if (Number(q) != q) errors.push('Not a number!'); // string is a number
    if (parseInt(q) < 0) errors.push('Negative value!'); //value is positive
    if (parseInt(q) != q) errors.push('Not an integer!'); //value is an integer
    return returnErrors ? errors : (errors.length == 0);
}

//purchase
app.post('/purchase', redirectDisplay, function(request, response){
    formData = request.body;
    request.session.checkout_info = formData;
    formData_email = request.body.email;

    var errors = [];

    if (/^[A-Za-z]+$/.test(request.body.firstname)) { //full name on name part
    }
    else {
      errors.push('-Use Only Letters for Full Name')
    }

    if (/^[A-Za-z]+$/.test(request.body.cardname)) { //full name on name part
    }
    else {
      errors.push('-Use Only Letters for cardname')
    }

    if(/^[0-9]+$/.test(request.body.cardnumber)){

    }else{
      errors.push('-invalid format for credit card numbers')
    }

    if(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(request.body.expyear)){

    }else{
      errors.push('-invalid format for credit card exp date ')
    }

    if(/^[0-9]+$/.test(request.body.cvv)){

    }else{
      errors.push('-invalid format for credit card cvv numbers')
    }

    //check if the email is in proper format.
    if (/^[^\s@]+@[^\s@]+$/.test(request.body.email) == false){
        errors.push("- The email address you entered is not in valid format.");
    }

    if(typeof request.session.cart == 'undefined' || request.session.cart.length == 0){
      errors.push("- The shopping cart is empty");
    }

  

//nodemailer referenced assignment 3 code examples
//Due to security concerns, 
//new gmail security update requrie user to lower their security protection inorder to send email via nodemailer,
//furthermore, it requires username and password authentications hardcoded
//thus, I have created a new temporary email for this use to prevent login credential leaks.
if(errors.length === 0){
  var invoice_str = `Thank you for your order!<table border><th>Item</th><th>Quantity</th><th>Price</th>`;
   var cart = request.session.cart;
   var subtotal = 0;

   for (var i = 0; i < cart.length; i++){
    extended_price = cart[i].price * cart[i].quantity;
    subtotal += extended_price;
    //console.log(cart[i]);
    invoice_str += `<tr><td style="text-align: center;">${cart[i].name}</td><td style="text-align: center;">${cart[i].quantity}</td><td>${cart[i].price * cart[i].quantity}</td><tr>`;
   }
     var tax_rate = 0.0471;
     var tax = tax_rate*subtotal;

     //compute shipping
     if(subtotal <=49) {
       shipping =0;
     }
    else if(subtotal <=200){
      shipping = 15;
    }
    else{
      shipping = 0.05*subtotal; // 5% of subtotal
    }
     //compute grant total
    var total = subtotal + tax + shipping;
   invoice_str += `<tr><td>total</td><td style="text-align: center;">$${total.toFixed(2)}</td><tr>`;
   invoice_str += '</table>';

    var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'itm352testing@gmail.com',
      pass: 'Admin123@'
    }
  });
    //construct the email details
  var mailOptions = {
    from: 'itm352testing@gmail.com',
    to: formData_email,
    subject: 'your stationary',
    html: invoice_str
  };

  //send the email
  transporter.sendMail(mailOptions, function(error, info){
    //if error;
    if (error) {
      ///redirect to this
      return response.redirect('/invoice.html?email_error=unable to send invoice to email');
    } else {
      //if not, redirect to this
      return response.redirect('/invoice.html');
    }

   });
}else if (errors.length > 0){
  request.query.errors = errors.join("<br />");
        response.redirect('checkout.html?' + queryString.stringify(request.query));
}
   

});


//server side
app.use(express.static('./public')); 
app.listen(8080, () => console.log(`listening on port 8080`)); // listen on port 8080 