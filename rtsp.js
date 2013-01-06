var net = require("net");
module.exports = (function()
{
	var r = 
	{
		client:0,
		c_seq:0, // for client
		session:0,
		c:0,
		state:0, // 1:steup 2:play 3:pause
		session:0,

		server_setup:function(data)
		{
			var msg = "";
			var c_seq = data.match(/CSeq: ([0-9]+)/)[1];
			this.session = Math.round(Math.random()*100000)
			msg += "RTSP/1.0 200 OK\n";
			msg += "CSeq: " + c_seq + "\n";
			msg += "Transport: RTP/AVP;unicast;client_port=3535;server_port=3535\n";
			msg += "Session: " + this.session;

			return msg;
		},

		client_setup:function()
		{
			this.c_seq++;
			var msg = "";
			msg += "SETUP rtsp://PG RTSP/1.0\n"; 
        	msg += "CSeq: " + this.c_seq + "\n"; 
        	msg += "Transport: RTP/AVP;unicast;client_port=3535\n";

        	return msg;
		},

		client_play:function()
		{
			this.c_seq++;
			var msg = "";
			msg += "PLAY rtsp://PG RTSP/1.0\n";
			msg += "CSeq: " + this.c_seq + "\n"; 
			msg += "Session: " + this.session + "\n";

			return msg;
		},

		server_play:function()
		{
			var msg = "";
			msg += "RTSP/1.0 200 OK\n";
			msg += "CSeq: " + this.c_seq + "\n"; 
			msg += "Session: " + this.session + "\n"; 
			msg += "RTP-Info: url=rtsp://PG\n";

			return msg;
		},

		client_pause:function()
		{
			this.c_seq++;
			var msg = "";
			msg += "PAUSE rtsp://PG RTSP/1.0\n";
			msg += "CSeq: " + this.c_seq + "\n"; 
			msg += "Session: " + this.session + "\n";

			return msg;
		},

		server_pause:function()
		{
			var msg = "";
			msg += "RTSP/1.0 200 OK\n";
			msg += "CSeq: " + this.c_seq + "\n"; 
			msg += "Session: " + this.session + "\n"; 

			return msg;
		},

		client_teardown:function()
		{
			this.c_seq++;
			var msg = "";
			msg += "PAUSE rtsp://PG RTSP/1.0\n";
			msg += "CSeq: " + this.c_seq + "\n"; 
			msg += "Session: " + this.session + "\n";

			return msg;
		},

		server_teardown:function()
		{
			var msg = "";
			msg += "RTSP/1.0 200 OK\n";
			msg += "CSeq: " + this.c_seq + "\n"; 
			msg += "Session: " + this.session + "\n"; 

			return msg;
		},

		server_mode:function()
		{
			var t;
			var server = net.createServer(function(c)
			{
				this.c = c;
				t = c;
				console.log("server connected");
				c.write("sever send test2");
				c.on("end", function(){console.log("server disconnected")});
				c.on("data", function(data)
				{
					console.log("read from client : ", data.toString());
					c.write("server echo : " + data);
					
				});


			});
			server.listen(3536, function(){console.log("server bound")});
			//t.write("server send test");
			//this.server_send("server send test");

		},
		client_mode:function()
		{
			c_seq = 0;
			this.client = net.connect({port:3536}, function()
			{

				console.log("client connected");
				this.write("client hello");

			});

			this.client.on("data", function(data)
			{
				console.log(data.toString());
				//client.end();


			});
			this.client.on("end", function()
			{
				console.log("client disconnected");

			});


		},
		client_send:function(data)
		{
			this.client.write(data);
		},
		server_send:function(data)
		{
			this.c.write(data);
		}
	}

	return r;

})();


