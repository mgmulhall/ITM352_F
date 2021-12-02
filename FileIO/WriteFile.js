var fs = require('fs');

data = "my attempt";
filename= "info.json";

fs.writeFileSync(filename,data,"utf-8");

