var a = require("../rtp.js");
a.init("127.0.0.1", 3535);
a.send(Buffer("asdfasdfasdfasdfasdfasdfasdf"), 0);