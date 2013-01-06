var net = require("net");
module.exports = (function()
{
	var r = 
	{
		server_mode:function()
		{
			var server = net.createServer(function(c)
			{
				console.log("server connected");
				c.on("end", function(){console.log("server disconnected")});
				c.on("data", function(data)
				{
					console.log("read from client : ", data);
					c.write("server echo : " + data);

				});

			});
			server.listen(3536, function(){console.log("server bound")});
		},
		client_mode:function()
		{
			var client = net.connect({port:3536}, function()
			{
				console.log("client connected");
				client.write("client hello");

			});

			client.on("data", function(data)
			{
				console.log(data.toString());
				client.end();


			});
			client.on("end", function()
			{
				console.log("client disconnected");

			});

		}
	}

	return r;

})();

