module.exports = (function()
{
	fs = require("fs");
	var r = 
	{
		total_len:0,
		file_size:[],
		file_size_raw:[],
		file_content:[],
		load:function(file_name, write_flag)
		{

			var fd = fs.openSync(file_name, "r") ;
			file_content = [];
			var tmp_buf = Buffer(4);
			fs.readSync(fd, tmp_buf, 0, 4);
			this.total_len = tmp_buf.readUInt32BE(0);
			//console.log(this.total_len);

			for (var i = 0; i < this.total_len; i++)
			{
				fs.readSync(fd, tmp_buf, 0, 4);
				var tmp_size = tmp_buf.readUInt32BE(0);
				this.file_size_raw.push(tmp_buf);
				this.file_size.push(tmp_size);
				var buf = new Buffer(tmp_size);
				fs.readSync(fd, buf, 0, buf.length);
				this.file_content.push(buf);
				if (write_flag)
				{
					var fn = "tmp_" + (i + 1);
					fs.writeFileSync(fn, buf);
				}
			}
			return this.total_len;

		},
		save:function(file_name)
		{

		},
		create:function(file_name, file_list)
		{
			var lens = [];
			var files = [];

			var fd = fs.openSync(file_name, "w");
			var len_tmp = Buffer(4);
			len_tmp.writeUInt32BE(file_list.length, 0);
			fs.writeSync(fd, len_tmp, 0, len_tmp.length);

			for (var i = 0; i < file_list.length; i++)
			{
				console.log("#", i+1);
				var content = fs.readFileSync(file_list[i]);
				var size = content.length;
				var size2 = Buffer(4);
				size2.writeUInt32BE(size, 0);
				fs.writeSync(fd, size2, 0, size2.length);
				fs.writeSync(fd, content, 0, content.length);
			}

			fs.close(fd);

		}
	}
	return r;
})();