require("colors");
var fs = require("fs");
var exec = require('child_process').exec;
var StreamPlayer = function(window_in)
{


	var r = 
	{

		RtpPacket:0,
		RtspPacket:0,
		buffer_lv:0,
		init:function()
		{
			this.RtpPacket = require("./rtp.js");
			this.RtspPacket = require("./rtsp.js");

			this.RtpPacket.init("127.0.0.1", 3535);
			this.RtpPacket.bind(3535, this.ev, this);
			
		},

		ev:function(target_frame, origin_caller)
		{
			//console.log("event is called", target_frame);
			var r = origin_caller.RtpPacket.recv_target_timestamp(target_frame);
			//console.log(r.length);
			if (target_frame % 2 == 1)
			{
				//console.log(W);

				this.buffer_lv = 3;
				console.log(String("[Save Frame #" + (target_frame-1)/2 + "] ").green);
				//fs.writeFileSync("./tmp/p_" + (target_frame-1)/2 + ".jpg", r);
				fs.writeFileSync("./content/tmp/p_" + (target_frame-1)/2 + ".jpg", r);
				//this.window_in.$("body").html("asdf");
				//this.RtpPacket.sleep(100);
				if (target_frame >= this.buffer_lv*2)
				{
					var fn = "./content/tmp/p_" + (target_frame - 1 - this.buffer_lv*2)/2 + ".jpg";
					if (fs.existsSync(fn))
					{
						W.$("#RtpPlayer").attr("src", "./tmp/p_" + (target_frame - 1 - this.buffer_lv*2)/2 + ".jpg");
					}
				}
				else
				{

				}

			}
		},
		delete_tmp_files:function()
		{
			var list = fs.readdirSync("./content/tmp");
			//console.log(list);
			for (var key in list)
			{
				fs.unlinkSync("./content/tmp/" + list[key]);
				//console.log("./content/tmp/" + list[key]);
			}
			console.log("[TEMP FILES DELETED]".cyan);
		},
		setup:function()
		{
			if (W.$("#IP_select").val() == "") W.$("#IP_select").val("140.113.253.35");
			this.RtspPacket.client_mode(W.$("#IP_select").val());
			
			this.first_time_play = true;
			//this.RtspPacket.client_mode("140.113.253.35");
			this.RtspPacket.client_send( this.RtspPacket.client_setup());
			//exec("del content\\tmp\\*");
			this.delete_tmp_files();
		},

		play:function()
		{
			if (this.first_time_play)
			{
				this.first_time_play = false;
				this.RtpPacket.max_time = -99999;
				this.RtpPacket.buf = [];
			}
			this.RtspPacket.client_send( this.RtspPacket.client_play());
		},

		pause:function()
		{
			this.RtspPacket.client_send( this.RtspPacket.client_pause());
		},

		teardown:function()
		{
			this.RtspPacket.client_send( this.RtspPacket.client_teardown());
			W.close();
		},


  }


  return r;

}




var app = module.exports = require('appjs');

app.serveFilesFrom(__dirname + '/content');

var window = app.createWindow({
  width  : 1200,
  height : 1000,
  title  : 'awawdawd',
  icons  : __dirname + '/content/icons'
});
var W = window;
window.on('create', function(){
  console.log("Window Created");
  window.frame.show();
  window.frame.center();
});

Rixia = StreamPlayer();
Rixia.init();

window.on('ready', function(){
  console.log("Window Ready");
  window.require = require;
  window.process = process;
  window.module = module;
  window.Rixia = Rixia;
  window.addEventListener('keydown', function(e){
    if (e.keyIdentifier === 'F12') {
      window.frame.openDevTools();
    }
  });

  console.log(StreamPlayer);

});

window.on('close', function(){
  console.log("Window Closed");
});