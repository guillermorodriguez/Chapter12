var http = require('http');
var httpDispatch = require('httpdispatcher');
var crypto = require("crypto-js");
var file = require('fs');

// Constants
var HOSTNAME = '127.0.0.1';
var PORT = 9595;
var KEY = '1234567890'

// Variable Instantiation
dispatch = new httpDispatch();

// Router Function Definition
function routerEngine(request, response){
    try{
        var occurred_on = new Date()
        console.log("%s - %s", occurred_on.toString(), request.url);

        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with, content-type, origin, authorization, accept, client-security-token");
        response.setHeader("Access-Control-Max-Age","1728000");

        dispatch.dispatch(request, response)
    }catch(err){
        console.log(err);
    }
}

// Software GET
dispatch.onGet("/api/v1.0/software", function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});

    // Read Code File
    file.readFile('ui.js', 'utf8', function(err, contents){
        var encrypted_text = crypto.AES.encrypt(contents, KEY).toString();

        console.log("Application code encrypted!")

        response.end(encrypted_text);
    });
});

// Account GET

// Account POST
dispatch.onPost("/api/v1.0/account", function(request, response){
    response.writeHead(200, {'Content-Type': 'application/json'});

    var envelope = JSON.parse(request.body);
    var outcome = false

    console.log("%s:%s access requested", envelope.user, envelope.password);

    try{
      contents = file.readFileSync('account/account.data', 'utf8');
      contents.split(/\r?\n/).forEach(line =>  {
        account = line.split(',')

        if (account.length == 3 && !outcome ) {
            if( account[0] == envelope.user && account[1] == envelope.password && account[2] == 'valid'){
              console.log("%s account validated", account[0])
              outcome = true;
            }
        }
      });

    }catch(err){
        response.end(JSON.stringify({ result: false, exception: err.message }));
    }finally{
      response.end(JSON.stringify({ result: outcome }));
    }
});

// Reservation GET

// Reservation POST
dispatch.onPost("/api/v1.0/reservation", function(request, response){
  response.writeHead(200, {'Content-Type': 'application/json'});

  var envelope = JSON.parse(request.body);
  var outcome = false

  console.log("Reservation request: %s <%s>", envelope.name, envelope.email);

  try{

    data = envelope.date + ',' + envelope.time + "," + envelope.name + ',' + envelope.telephone + ',' + envelope.email + "\r\n";
    file.appendFileSync("reservation/reservation.data", data);
    outcome = true

  }catch(err){
      response.end(JSON.stringify({ result: false, exception: err.message }));
  }finally{
    response.end(JSON.stringify({ result: outcome }));
  }

});

// Hour POST
dispatch.onPost("/api/v1.0/hour", function(request, response){
  response.writeHead(200, {'Content-Type': 'application/json'});

  var envelope = JSON.parse(request.body);
  var outcome = false

  console.log("Reservation request: %s <%s>", envelope.name, envelope.email);

  try{

    data = envelope.monday + ',' + envelope.tuesday + "," + envelope.wednesday + ',' + envelope.thursday + ',' + envelope.friday + ',' + envelope.saturday + ',' + envelope.sunday + "\r\n";
    file.appendFileSync("hour/hour.data", data);
    outcome = true

  }catch(err){
      response.end(JSON.stringify({ result: false, exception: err.message }));
  }finally{
    response.end(JSON.stringify({ result: outcome }));
  }
});

// Router Object Instantiation
var server = http.createServer(routerEngine);

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server instance initialized at ${HOSTNAME}:${PORT}`)
})
