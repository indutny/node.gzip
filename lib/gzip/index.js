var spawn = require('child_process').spawn,
    buffer = require('buffer').Buffer;

exports.gzip = function(data) {
  var rate = 8,
      enc = 'utf8',
      isBuffer = buffer.isBuffer(data),
      args = Array.prototype.slice.call(arguments, 1),
      callback;
  
  if (!isBuffer && typeof args[0] === 'string') {
    enc = args.shift();
  }
  
  if (typeof args[0] === 'number') {
    rate = args.shift() - 0;
  }
  callback = args[0];
  
  if (!callback) return;
  
  var gzip = spawn('gzip', ['-' + (rate-0),'-c', '-']);
  
  var output = new buffer(0);
  
  gzip.stdout.on('data', function(data) {  
    output = data;
  });
  
  gzip.on('exit', function(code) {
    callback(code, output);
  });
  
  if (isBuffer) {    
    gzip.stdin.encoding = 'binary';    
    gzip.stdin.end(data.length ? data: '');
  } else {  
    gzip.stdin.end(data ? data.toString() : '', enc);
  }
};