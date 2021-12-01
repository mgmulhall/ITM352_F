var fs = require('fs');// requires file IO in order to rememeber information and saves it in the varible 'fs'

var filename = "info.json"; // put info data into varible filename

if (fs.existsSync(filename)){
    data = fs.readFileSync(filename,'utf-8');
    console.log("success! We got:" + data);
} else
{
console.log("Sorry" + filename);
}

