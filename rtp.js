var dgram = require('dgram');
module.exports = (function()
{
	var r = 
	{
		time:0, // for send
		max_time:0, // for receive
		seq:0, // for send
		max_seq:0, // for receive
		SSRC:0,
		RTP:0,
		ip:0,
		port:0,
		buf:0,
		packet_size:10240,
		receiver_event:0,
		nexttimestamp_event:0,
		nexttimestamp_event_origin_caller:0,
		sleep:function(ms)
		{
			var startTime = new Date().getTime();
			while (new Date().getTime() < startTime + ms);
		},
		bits_to_bytes:function(q)
		{
			var r = 0;
			while (q.length % 8) q = "0" + q;
			for (var i = 0; i < q.length; i += 8)
			{
				var tmp = 0;
				for (var j = 0; j < 8; j++)
				{
					if (q[i+j] == "1")
					{
						tmp += 1;
					} 
					if (j < 7) tmp <<= 1;
				}
				r *= 256;
				r += tmp;
			}
			return r;

		},
		make_rtp_packet:function(seq_in, timestamp_in, SSRC_in, payload_in)
		{
			var r = new Buffer(96 + this.packet_size);
			var z = 0;
			r.fill(0, 0, r.length);
			var Version = "10";
			var Padding = "0";
			var eXtension = "0";
			var CsrcCount= "0000";
			//---------------------------------
			var Marker = "0";
			var PayloadType = "000000";
			//---------------------------------
			var SequenceNumber = seq_in; // 16bits
			var Timestamp = timestamp_in; // 32bits
			var SSRC = SSRC_in; //32bits
			//var CSRC = CSRC_in; //32bits
			//---------------------------------
			var first_byte = this.bits_to_bytes(Version + Padding + eXtension + CsrcCount);
			var second_byte = this.bits_to_bytes(Marker + PayloadType);
			//console.log("first / second", first_byte, second_byte);
			r.writeUInt8(first_byte, 0);
			r.writeUInt8(second_byte, 1);
			r.writeUInt16BE(SequenceNumber, 2);
			r.writeUInt32BE(Timestamp, 4);
			r.writeUInt32BE(SSRC, 8);
			payload_in.copy(r, 96, 0, this.packet_size);
			//console.log(r);
			return r;
		},
		extract_rtp_packet:function(target_packet)
		{
			var SequenceNumber = target_packet.readUInt16BE(2);
			var Timestamp = target_packet.readUInt32BE(4);
			var payload = new Buffer(this.packet_size);
			var ssrc = target_packet.readUInt32BE(8);
			//console.log(target_packet.length+96);
			target_packet.copy(payload, 0, 96, target_packet.length);

			//console.log("SequenceNumber", SequenceNumber);
			//console.log("Timestamp", Timestamp);
			//console.log("payload", payload);
			//console.log(payload.toString("utf8", 0, target_packet.length - 96));
			return Array(SequenceNumber, Timestamp, payload, ssrc);

		},
		init:function(ip_in, port_in)
		{
			this.time = this.seq = 0;
			this.max_time = this.max_seq = -99999;
			this.RTP = dgram.createSocket("udp4");
			this.ip = ip_in;
			this.port = port_in;
			this.SSRC = Math.round(Math.random()*100000);
			this.buf = [];

		},
		receiver:function(buffer_in)
		{
			
			//console.log("receiver #1", buffer_in, buffer_in.length);
			var tmp = this.extract_rtp_packet(buffer_in);
			this.buf.push(tmp);
			if (tmp[0] > this.max_seq) this.max_seq = tmp[0];
			if (tmp[1] > this.max_time)
			{
				
				if (tmp[1] != 0)
				{
<<<<<<< HEAD
					this.nexttimestamp_event(this.max_time, this.nexttimestamp_event_origin_caller);
=======
					if (this.nexttimestamp_event) this.nexttimestamp_event(this.max_time, this.nexttimestamp_event_origin_caller);
>>>>>>> origin/dev
					//console.log("nexttime", this.max_time);
				}
				this.max_time = tmp[1];
				
			}
			//console.log("revceiver", this.buf[this.buf.length - 1]);
			//console.log("receiver size:", this.buf.length);
			//if (this.buf.length >= 5) this.recv();
			//console.log(this.recv_once());
			//if (this.seq > 3) this.recv_target_timestamp(1);

			//console.log("recv #", this.max_seq, "buf size:", this.buf.length, "max time:", this.max_time);
			if (this.max_seq % 100 == 0) console.log("recv #", this.max_seq);
			//this.receiver_event();
		},
		send:function(buffer_in, timestamp_in)
		{
			//console.log(this.ip);
			for (var i = 0; i < buffer_in.length; i += this.packet_size)
			{
				if (timestamp_in == undefined)
				{
					console.log("Err at send");
					timestamp_in = this.time;
					return;
				}
				var tmp = new Buffer(this.packet_size);
				tmp.fill(0, 0, this.packet_size);
				var endpoint = i + this.packet_size;
				if (endpoint > buffer_in.length) endpoint = buffer_in.length;
				buffer_in.copy(tmp, 0, i, endpoint);

				var s = this.make_rtp_packet(++this.seq, timestamp_in, this.SSRC, tmp);
				var chk = this.extract_rtp_packet(s);
				//console.log("chk time stamp", chk[0], chk[1]);
				this.RTP.send(s, 0, s.length, this.port, this.ip);
				this.sleep(1);
			}
		},
		recv:function()
		{
			var r = new Buffer(1024*1024*10);
			var pointer = 0;
			for (var i = 0; i < this.buf.length; i++)
			{
				//var tmp = Buffer(1000);
				//tmp.fill(0, 0, tmp.length);
				this.buf[i][2].copy(r, pointer, 0, this.buf[i][2].length);
				//this.buf[i][2].copy(tmp, pointer, 0, this.buf[i][2].length);
				//console.log(tmp.toString("utf8", 0, 50));
				pointer += this.buf[i][2].length;
			}
			console.log("-----");
			console.log("recv", r.toString("utf8", 0, 50));
			console.log("-----");
			this.buf = [];
			return r;
		},
		recv_once:function()
		{
			var r = this.buf.shift();
			return r[2];
		},
		recv_target_timestamp:function(target_timestamp)
		{
			//console.log("recv_target_timestamp");
			var r = new Buffer(1024*1024*10);
			var pointer = 0;
			var new_ary = [];
			for (var i = 0; i < this.buf.length; i++)
			{
				//console.log("#", i, this.buf[i][1]);
				if (this.buf[i][1] == target_timestamp)
				{
					this.buf[i][2].copy(r, pointer, 0, this.buf[i][2].length);
					pointer += this.buf[i][2].length;
				}
				else
				{
					new_ary.push(this.buf[i]);
				}
			}
			if (pointer == 0)
			{
				//console.log("recv_target_timestamp empty");
				return false;
			}
			r = r.slice(0, pointer);
			console.log("recv_target_timestamp", r.toString("utf8", 0, 30), pointer);
			this.buf = new_ary;
			return r;
		},
		close:function()
		{
			this.RTP.close();
		},
		bind:function(port_in, event_in, origin_in)
		{
			var ori = this;
			this.nexttimestamp_event = event_in;
			this.nexttimestamp_event_origin_caller = origin_in;
			this.RTP.on("message", function (msg, rinfo)
			{
				//console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);

				ori.receiver(msg);
			});
			RTP2 = this.RTP;
			this.RTP.on("listening", function () {
				var address = RTP2.address();
				console.log("server listening " + address.address + ":" + address.port);
			});
			console.log("before bind");
			this.RTP.bind(port_in);
			console.log("after bind");
			return "OK";
		}
	}
	return r;
})();


//a.send(Buffer("123456789abcde"));
//a.close();

/*
var dgram = require('dgram');
var message = new Buffer("Some bytes");
var client = dgram.createSocket("udp4");
var tmp = new Buffer("asdfasdfasdfasdf");
client.send(tmp, 0, tmp.length, 3535, "localhost")
client.send(message, 0, message.length, 3535, "localhost", function(err, bytes) {
	console.log(err, bytes);
	client.send(message, 0, message.length, 43535, "localhost" )
  client.close();
});
*/