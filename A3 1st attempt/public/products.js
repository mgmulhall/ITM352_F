//Krizel Tomines & Margaret Mulhall; idea from Chloe Cheng
var products =
[
    {
        "type": "boba",
        "image": "./images/titlepage/tboba.JPG"
    },



    {
        "type": "smoothies",
        "image": "./images/titlepage/tsmoothie.JPG"
    },



    {
        "type": "scones",
        "image": "./images/titlepage/tscones.JPG"
    },

    {
        "type": "ice cream",
        "image": "./images/titlepage/ticecream.JPG"
    }

];

// the diff. types
var boba =
[
{
    "brand": "Rabbit Signature",
    "price": 5.00,
    "image": "./images/rbtsig.jpeg",
    "quantity_available": 9
},

{
    "brand": "Tiramisu Milk Tea",
    "price": 5.00,
    "image":  "./images/tiramisu.jpeg",
    "quantity_available": 9
},

{
    "brand": "Queen of Hearts Mojito",
    "price": 5.00,
    "image":  "./images/mojito.jpeg",
    "quantity_available": 9
}
];
var smoothies =
[
{
    "brand": "Cloudy Day",
    "price": 5.00,
    "image": "./images/cloudyday.jpg",
    "quantity_available": 9
},
{
    "brand": "Sulley's Cloud",
    "price": 5.00,
    "image": "./images/sulleyscloud.jpg",
    "quantity_available": 9
},
{
    "brand": "Sunny Day",
    "price": 5.00,
    "image":  "./images/sunnyday.jpg",
    "quantity_available": 9
}];

var scones =
[
{
    "brand": "Blueberry White Chocolate Chunk ",
    "price": 5.00,
    "image": "./images/blueberrywhite.jpg",
    "quantity_available": 9
},
{
    "brand": "Lemon Poppy",
    "price": 5.00,
    "image": "./images/lemonpoppy.jpg",
    "quantity_available": 9
},
{
    "brand": "Orange Cranberry",
    "price": 5.00,
    "image":  "./images/orangecran.jpg",
    "quantity_available": 9
}];
var icecream =
[
{
    "brand": "Macadamia Nut",
    "price": 5.00,
    "image": "./images/macnut.jpg",
    "quantity_available": 9
},
{
    "brand": "Strawberry",
    "price": 5.00,
    "image": "./images/strawberry.jpeg",
    "quantity_available": 9
},
{
    "brand": "Blueberry",
    "price": 5.00,
    "image":  "./images/blueberry.jpeg",
    "quantity_available": 9
}]
// an array of the products we would like to sell 

// create a product array with all products; author: chloeexcc
var allProducts = {
    "pen": pen,
    "notebook": notebook,
    "folder": folder,
    "accessories": accessories
}
if (typeof module != 'undefined') {
    module.exports.allProducts = allProducts;   // export the products 
  }