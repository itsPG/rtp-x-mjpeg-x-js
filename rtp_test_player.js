var a = require("./rtp.js");
a.init("127.0.0.1", 3535);
a.bind(3535, function(){console.log(123);});