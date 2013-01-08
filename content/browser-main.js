addEventListener('app-ready', function(e)
{
    require("colors");
	var fs = require("fs");
	var StreamPlayer = function()
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
				//console.log(r.length);
				if (target_frame % 2 == 1)
				{
					console.log(String("[Save Frame #" + (target_frame-1)/2 + "] ").green);
					fs.writeFileSync("./tmp/p_" + (target_frame-1)/2 + ".jpg", r);
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
	var Rixia = StreamPlayer();
	Rixia.init();
	//console.log(Rixia);
	$(".btn").click(function(){
		//alert($(this).attr("act"));
		cmd = "Rixia." + $(this).attr("act") + "()";
		alert(cmd);
		eval(cmd);
	});
    window.dispatchEvent(new Event('app-done'));
});