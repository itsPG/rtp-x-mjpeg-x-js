var StreamServer = function()
{
	var r =
	{
		RtpPacket:0,
		RtspPacket:0,
		PG_mjpeg:0,
		frame_pointer:0,
		max_frame:0,
		state:0,
		first_init:true,
		self:0,
		set_IP_flag:0,

		sleep:function(ms)
		{
			var startTime = new Date().getTime();
			while (new Date().getTime() < startTime + ms);
		},
		init:function(ip_in, port_in, movie_name)
		{
			this.RtpPacket = require("./rtp.js");
			this.RtspPacket = require("./rtsp.js");
			this.PG_mjpeg = require("./mjpeg.js");
			if (this.first_init)
			{	
				console.log("first_init");
				this.RtspPacket.server_mode(this);
				//this.RtpPacket.init(ip_in, port_in);
				this.max_frame = this.PG_mjpeg.load(movie_name);
				this.first_init = false;

			}
			this.state = 0;
			this.frame_pointer = 0;

			this.self = this;
			console.log(this.max_frame);
		},
		send:function(tmp, t)
		{
			this.RtpPacket.send(tmp, t);
		},
		send_target_frame:function(frame_no)
		{
			//console.log("send frame_no size", this.PG_mjpeg.file_size_raw[frame_no]);
			this.RtpPacket.send(this.PG_mjpeg.file_size_raw[frame_no], frame_no*2);
			this.sleep(10);
			this.RtpPacket.send(this.PG_mjpeg.file_size_raw[frame_no], frame_no*2);
			this.sleep(10);
			//console.log("start to send frame");
			this.RtpPacket.send(this.PG_mjpeg.file_content[frame_no], frame_no*2 + 1);
			this.sleep(40);

		},

		play:function()
		{
			for(;this.frame_pointer < this.max_frame; this.frame_pointer++)
			{
				this.send_target_frame(this.frame_pointer);
			}
			this.send(Buffer(1), 999999999);
		},
		call_test:function()
		{
			console.log("OK");
		},
		main_loop:function()
		{
			var ori_this = this;

			if (this.state == 1)
			{
				if (!this.set_IP_flag)
				{
					var IP = this.RtspPacket.IP;
					console.log("[setup] IP", IP);
					this.RtpPacket.init(IP, 3535);
					this.set_IP_flag = true;
				}
				this.RtpPacket.max_time = -99999;
				this.frame_pointer = 0;
				console.log("reset".cyan);
				this.state = 1.5;

				
			}

			if (this.state == 2)
			{
				if (this.frame_pointer < this.max_frame)
				{
					console.log("[play] #", this.frame_pointer);
					this.send_target_frame(this.frame_pointer);
					this.frame_pointer++;
				}
				else if (this.frame_pointer == this.max_frame)
				{

					this.sleep(1000);
					console.log("[END]");
					this.send(Buffer(4), 999999999);
					this.state = 0;
					
					this.init();
				}
			}
			if (this.state == -1)
			{
				this.state = 0;
				this.set_IP_flag = 0;
				this.RtspPacket.state = 0;
				this.init();
			}
			//if (this.state != -1) 
			setTimeout(function(){ ori_this.main_loop() }, 10);

		}

	};
	return r;	
	
};
var t = StreamServer();
t.init("127.0.0.1", 3535, "PG.mjpeg");
t.init("127.0.0.1", 3535, "PG.mjpeg");
t.main_loop();
// t.state = 2;
// setTimeout(function(){ t.state = 3 }, 1000);
// setTimeout(function(){ t.state = 2 }, 3000);
// t.main_loop();

