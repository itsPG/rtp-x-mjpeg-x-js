var StreamServer = function()
{
	var r =
	{
		RtpPacket:0,
		PG_mjpeg:0,
		frame_pointer:0,
		max_frame:0,
		sleep:function(ms)
		{
			var startTime = new Date().getTime();
			while (new Date().getTime() < startTime + ms);
		},
		init:function(ip_in, port_in, movie_name)
		{
			this.RtpPacket = require("./rtp.js");
			this.PG_mjpeg = require("./mjpeg.js");
			this.RtpPacket.init(ip_in, port_in);
			this.max_frame = this.PG_mjpeg.load(movie_name);
			console.log(this.max_frame);
		},
		send:function(tmp, t)
		{
			this.RtpPacket.send(tmp, t);
		},
		send_target_frame:function(frame_no)
		{
			console.log("send frame_no size", this.PG_mjpeg.file_size_raw[frame_no]);
			this.RtpPacket.send(this.PG_mjpeg.file_size_raw[frame_no], frame_no*2);
			this.sleep(1000);
			console.log("start to send frame");
			this.RtpPacket.send(this.PG_mjpeg.file_content[frame_no], frame_no*2 + 1);

		},
		play:function()
		{
			for(;this.frame_pointer < this.max_frame; this.frame_pointer++)
			{
				this.send_target_frame(this.frame_pointer);
			}
			this.send(Buffer(1), 999999999);

		}

	};
	return r;	
	
};
var t = StreamServer();
t.init("127.0.0.1", 3535, "PG.mjpeg");
t.play();