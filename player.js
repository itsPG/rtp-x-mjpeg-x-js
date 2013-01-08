require("colors");
var fs = require("fs");
<<<<<<< HEAD
var StreamPlayer = function()
=======
var StreamPlayer = function(window_in)
>>>>>>> origin/dev
{
	var r = 
	{
		RtpPacket:0,
		RtspPacket:0,

		init:function()
		{
			this.RtpPacket = require("./rtp.js");
			this.RtspPacket = require("./rtsp.js");

			this.RtpPacket.init("127.0.0.1", 3535);
			this.RtpPacket.bind(3535, this.ev, this);

			this.RtspPacket.client_mode();
		},

		ev:function(target_frame, origin_caller)
		{
			//console.log("event is called", target_frame);
			var r = origin_caller.RtpPacket.recv_target_timestamp(target_frame);

			if (target_frame % 2 == 1)
			{
				console.log(String("[Save Frame #" + (target_frame-1)/2 + "] ").green);
				fs.writeFileSync("./content/tmp/p_" + (target_frame-1)/2 + ".jpg", r);
			}
		},

		setup:function()
		{
			
			this.RtspPacket.client_send( this.RtspPacket.client_setup());
		},

		play:function()
		{
			this.RtspPacket.client_send( this.RtspPacket.client_play());
		},

		pause:function()
		{
			this.RtspPacket.client_send( this.RtspPacket.client_pause());
		},

		teardown:function()
		{
			this.RtspPacket.client_send( this.RtspPacket.client_teardown());
		},


	}
	return r;
}

 //var t = StreamPlayer();
//t.init();
// //t.setup();
 //setTimeout(function(){ t.setup() }, 1000);
 //setTimeout(function(){ t.play() }, 2000);

