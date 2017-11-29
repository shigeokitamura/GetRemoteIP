var sys = require("util");
var http = require("http");
var dns = require("dns");

var getIP = function (req) {
  if (req.headers['x-forwarded-for']) {
    return req.headers['x-forwarded-for'];
  }
  if (req.connection && req.connection.remoteAddress) {
    return req.connection.remoteAddress;
  }
  if (req.connection.socket && req.connection.socket.remoteAddress) {
    return req.connection.socket.remoteAddress;
  }
  if (req.socket && req.socket.remoteAddress) {
    return req.socket.remoteAddress;
  }
  return '0.0.0.0';
};

var getHost = function(ip) {
    var host =  dns.reverse(ip, function(err, domains) {
        if (err) {
            return err.toString();
        }
        return domains.toString();
    });
    return host;
};

var server = http.createServer(
  function (request, response) {
    var ip = getIP(request);
    console.log(ip);
    // dns.reverse(ip, function(err, domains) {
    //     if(err) {
    //         console.log(err.toString());
    //     }
    //     console.log(domains);
    // });
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end();

  }
).listen(3000);
