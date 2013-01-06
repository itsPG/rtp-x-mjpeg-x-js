s = require("./rtsp.js");
s.client_mode();

s.client_send( s.client_setup());
setTimeout(function(){ s.client_send( s.client_play()); }, 300);
setTimeout(function(){ s.client_send( s.client_pause()); }, 600);
setTimeout(function(){ s.client_send( s.client_play()); }, 900);
setTimeout(function(){ s.client_send( s.client_teardown()); }, 1200);
setTimeout(function(){ s.client_close(); }, 1500);