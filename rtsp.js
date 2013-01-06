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
		event_function:0,

		server_setup:function(data)
		{
			//data = data.toString();
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

		server_mode:function(event_function_in, origin_caller)
		{
			var t;
			if (event_function_in != undefined)
			{
				this.event_function = event_function_in;
			}
			else this.event_function = function(){};
			var ori_this = this;
			var server = net.createServer(function(c)
			{
				ori_this.state = 0;
				console.log("server connected");
				//c.write("sever send test2");
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
						ori_this.event_function("TEARDOWN");
						origin_caller.state = -1;
						//c.close();
					}
					else if (ori_this.state == 0 && data.search(/SETUP/i) != -1)
					{
						ori_this.state = 1;
						origin_caller.state = 1;
						ori_this.server_setup(data);
						ori_this.event_function("SETUP");
						
						console.log(String("[setup]").cyan);

					}
					else if (ori_this.state == 1 && data.search(/PLAY/i) != -1)
					{
						ori_this.state = 2;
						origin_caller.state = 2;
						ori_this.server_play(data);
						ori_this.event_function("PLAY");
						
						console.log(String("[play]").green);
					}
					else if (ori_this.state == 2 && data.search(/PAUSE/i) != -1)
					{
						ori_this.state = 3;
						origin_caller.state = 3;
						ori_this.server_pause(data);
						ori_this.event_function("PAUSE");
						console.log(String("[pause]").yellow);
					}
					else if (ori_this.state == 3 && data.search(/PLAY/i) != -1)
					{
						ori_this.state = 2;
						origin_caller.state = 2;
						ori_this.server_play(data);
						ori_this.event_function("PLAY");
						console.log(String("[play]").green);
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
		client_mode:function()
		{
			c_seq = 0;
			ori_this = this;
			this.client = net.connect({port:3536}, function()
			{

				console.log("client connected");
				//this.write("client hello");

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
			//console.log("client send", data);
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


