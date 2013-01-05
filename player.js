var RtpPacket = require("./rtp.js");
var fs = require("fs");
var last_SSRC = -1;
function ev(target_frame)
{
	if (last_SSRC == -1) last_SSRC = RtpPacket.SSRC;
	else
	{
		//last_SSRC = 
	}
	console.log("event is called", target_frame);
	var r = RtpPacket.recv_target_timestamp(target_frame);
	console.log(r.length);
	if (target_frame % 2 == 1) fs.writeFileSync("./tmp/p_" + (target_frame-1)/2 + ".jpg", r);
}
RtpPacket.init("127.0.0.1", 3535);
RtpPacket.bind(3535, ev);