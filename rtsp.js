var net = require("net");
require("colors");
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
		IP:0,


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
			msg += "TEARDOWN rtsp://PG RTSP/1.0\n";
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

		server_mode:function(origin_caller)
		{
			var t;
			var ori_this = this;
			var server = net.createServer(function(c)
			{
				ori_this.state = 0;
				console.log("server connected");

				console.log("[IP] " + c.remoteAddress);
				ori_this.IP = c.remoteAddress;
				c.on("end", function(){console.log("server disconnected")});

				c.on("data", function(ori_data)
				{
					
					var data = ori_data.toString();
					console.log(String(data).cyan);

					//console.log("read from client : ", data.toString());
					//c.write("server echo : " + data);
					//console.log(ori_this.state, data.search(/SETUP/i));
					if (data.search(/TEARDOWN/i) != -1)
					{
						origin_caller.state = -1;
						console.log(String("[end ]").red);
						//c.close();
					}
					else if (ori_this.state == 0 && data.search(/SETUP/i) != -1)
					{
						ori_this.state = 1;
						origin_caller.state = 1;
						ori_this.server_setup(data);
						
						console.log(String("[setup]").cyan);

					}
					else if (ori_this.state == 1 && data.search(/PLAY/i) != -1)
					{
						ori_this.state = 2;
						origin_caller.state = 2;
						ori_this.server_play(data);
						
						console.log(String("[play]").green);
					}
					else if (ori_this.state == 2 && data.search(/PAUSE/i) != -1)
					{
						ori_this.state = 3;
						origin_caller.state = 3;
						ori_this.server_pause(data);

						console.log(String("[pause]").yellow);
					}
					else if (ori_this.state == 3 && data.search(/PLAY/i) != -1)
					{
						ori_this.state = 2;
						origin_caller.state = 2;
						ori_this.server_play(data);

						console.log(String("[play]").green);
					}
					else if (ori_this.state == 3 && data.search(/TEARDOWN/i) != -1)
					{
						ori_this.state = 0;
						origin_caller.state = 0;
						ori_this.server_play(data);

						console.log(String("[teardown]").green);
					}
					else
					{
						console.log(("error state").red);
					}
					
				});


			});
			server.listen(3536, function(){console.log("server bound")});
			//t.write("server send test");
			//this.server_send("server send test");

		},
		client_mode:function(IP_in)
		{
			c_seq = 0;
			ori_this = this;
			if (IP_in != undefined) this.IP = IP_in;
			else this.IP = "localhost";
			this.client = net.connect({port:3536, host:this.IP}, function()
			{
				console.log("client connected");
			});

			this.client.on("data", function(data)
			{
				console.log(data.toString());
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
		},

		client_close:function()
		{
			this.client.end();
		}
	}

	return r;

})();


