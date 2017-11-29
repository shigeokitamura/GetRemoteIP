var sys = require("util");
var http = require("http");
var dns = require("dns");

var getIP = function (req) {
  //console.log(req);
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

var server = http.createServer(
  function (request, response) {
    var ip = getIP(request).split(",");
    console.log(ip[0]);
    try {
      dns.reverse(ip[0], function(err, domains) {
        if(err) {
          console.log(err.toString());
          domains = ip[0];
        }
        //console.log(domains);

        var jsonData = {
          "ip"   : ip[0],
          "host" : domains.toString(),
          "time" : new Date()
        };

        var jsonString = JSON.stringify(jsonData);

        response.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":"*"
        });
        response.write(jsonString);
        response.end();
      });
    } catch (e) {
      console.log(e);
    }
  }
).listen(process.env.PORT, function(){
  console.log("This app is listening on port" + server.address().port);
});
