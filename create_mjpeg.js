a = require("./mjpeg.js");
//a.load("movie.mjpeg");

if (0)
{
	var list = [];
	for (var i = 111; i <= 147; i++)
	{
		list.push("./img/seto_no_hanayome_01_" + i + ".jpg");
	}
	for (var i = 111; i <= 147; i++)
	{
		list.push("./img/seto_no_hanayome_01_" + i + ".jpg");
	}
	for (var i = 111; i <= 147; i++)
	{
		list.push("./img/seto_no_hanayome_01_" + i + ".jpg");
	}
	a.create("PG.mjpeg", list);
}

if (1)
{
	a.scan_dir_and_create("pass2.mjpeg", "./pass2/");
}