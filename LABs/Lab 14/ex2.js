var fs = require('fs');
const { exit } = require('process');

var filename = "./user_data.json";
//if file exists, safe contense in data, parse it into use_data and log it
if (fs.existsSync(filename)) {
    data = fs.readFileSync(filename, 'utf-8');

    user_data = JSON.parse(data);
    console.log("User_data=", user_data);
// statsync grabs info on file
    fileStats = fs.statSync(filename);
    console.log("File " + filename + " has " + fileStats.size + " characters");
} else {
    console.log("Enter the correct filename bozo!");
    exit("Exiting program");
}
