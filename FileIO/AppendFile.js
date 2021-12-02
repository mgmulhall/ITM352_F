var fs = require('fs');

data= "\nnew stuff";
filename = "info.json";

fs.appendFileSync(filename, data, "utf-8");