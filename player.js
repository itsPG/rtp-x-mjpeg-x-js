var RtpPacket = require("./rtp.js");
var fs = require("fs");
function ev(target_frame)
{
	console.log("event is called", target_frame);
	var r = RtpPacket.recv_target_timestamp(target_frame);
	console.log(r.length);
	if (target_frame % 2 == 1) fs.writeFileSync("p_" + (target_frame-1)/2 + ".jpg", r);
}
RtpPacket.init("127.0.0.1", 3535);
RtpPacket.bind(3535, ev);