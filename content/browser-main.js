addEventListener('app-ready', function(e)
{
    
	var fs = require("fs");
	$(".btn").click(function(){
		var act = $(this).attr("act");
		if (act == "setup") Rixia.setup();
		if (act == "play") Rixia.play();
		if (act == "pause") Rixia.pause();
		if (act == "teardown") Rixia.teardown();


	});

    //window.dispatchEvent(new Event('app-done'));
});

//addEventListener("PG", function(e){alert("PG");});