addEventListener('app-ready', function(e)
{
    var fs = require('fs');
    //var path = require('path');

    window.dispatchEvent(new Event('app-done'));
});