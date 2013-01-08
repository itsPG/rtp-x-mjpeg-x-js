a = require("./mjpeg.js");
//a.load("movie.mjpeg");
var list = [];
for (var i = 111; i <= 147; i++)
{
	list.push("./img/seto_no_hanayome_01_" + i + ".jpg");
}
a.create("PG.mjpeg", list);
//a.load("PG.mjpeg", true);