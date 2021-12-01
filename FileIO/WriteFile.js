var fs = require('fs');

data = "third attempt";
filename= "info.json"

fs.writeFileSync(filename,data,"utf-8");
console.log()
