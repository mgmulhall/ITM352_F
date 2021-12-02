var fs= require('fs');
var myParser = require('body-parser');

var filename = "user_info.json";

var raw_data = fs.readFileSync(filename,'utf-8');
var user_info = JSON.parse(raw_data);

console.log(user_info);