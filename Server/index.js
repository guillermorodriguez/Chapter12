var http = require('http');
var httpDispatch = require('httpdispatcher');
var crypto = require("crypto-js");
var file = require('fs');
var url = require('url');

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

/*************************************************************************************************************

    SOFTWARE

*************************************************************************************************************/
// GET
dispatch.onGet("/api/v1.0/software", function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});

    // Read Code File
    file.readFile('ui.js', 'utf8', function(err, contents){
        var encrypted_text = crypto.AES.encrypt(contents, KEY).toString();

        console.log("Application code encrypted!")

        response.end(encrypted_text);
    });
});

/*************************************************************************************************************

    ACCOUNT

*************************************************************************************************************/
// GET
dispatch.onGet("/api/v1.0/account", function(request, response){
  response.writeHead(200, {'Content-Type': 'application/json'});

  var envelope = url.parse(request.url, true).query;
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

// POST
dispatch.onPost("/api/v1.0/account", function(request, response){
    response.writeHead(200, {'Content-Type': 'application/json'});

    var envelope = JSON.parse(request.body);
    var outcome = false

    console.log("%s:%s account creation requested", envelope.user, envelope.password);

    try{

      data = envelope.user + ',' + envelope.password + ",valid\r\n";
      file.appendFileSync("account/account.data", data);
      outcome = true

    }catch(err){
        response.end(JSON.stringify({ result: false, exception: err.message }));
    }finally{
      response.end(JSON.stringify({ result: outcome }));
    }
});

/*************************************************************************************************************

    RESERVATION

*************************************************************************************************************/
// DELETE

// GET

// POST
dispatch.onPost("/api/v1.0/reservation", function(request, response){
  response.writeHead(200, {'Content-Type': 'application/json'});

  var envelope = JSON.parse(request.body);
  var outcome = false

  console.log("Reservation request: %s <%s>", envelope.name, envelope.email);

  try{

    data = envelope.date + ',' + envelope.time + "," + envelope.name + ',' + envelope.telephone + ',' + envelope.email + "\r\n";
    file.appendFileSync("reservation/reservation.data", data);
    outcome = true

    console.log("Reservation stored successfully");

  }catch(err){
      response.end(JSON.stringify({ result: false, exception: err.message }));
  }finally{
    response.end(JSON.stringify({ result: outcome }));
  }

});

/*************************************************************************************************************

    HOUR

*************************************************************************************************************/
// GET
dispatch.onGet("/api/v1.0/hour", function(request, response){
  response.writeHead(200, {'Content-Type': 'application/json'});

  var outcome = {};

  console.log("Hours requested");

  try{
    contents = file.readFileSync('hour/hour.data', 'utf8');
    contents = contents.split(/\r?\n/);

    if (contents.length > 0) {
      data = contents[0].split(',')
      outcome = {
        "Monday" : data[0].split(':')[1],
        "Tuesday" : data[1].split(':')[1],
        "Wednesday" : data[2].split(':')[1],
        "Thursday" : data[3].split(':')[1],
        "Friday" : data[4].split(':')[1],
        "Saturday" : data[5].split(':')[1],
        "Sunday" : data[6].split(':')[1],
      }
    }

  }catch(err){
      response.end(JSON.stringify({ result: {}, exception: err.message }));
  }finally{
    response.end(JSON.stringify({ result: outcome }));
  }
});

// POST
dispatch.onPost("/api/v1.0/hour", function(request, response){
  response.writeHead(200, {'Content-Type': 'application/json'});

  var envelope = JSON.parse(request.body);
  var outcome = false

  console.log("Restaurant hours updated");

  try{

    data =  "Monday:" + envelope.monday + ',' +
            "Tuesday:" + envelope.tuesday + "," +
            "Wednesday:" + envelope.wednesday + ',' +
            "Thursday:" + envelope.thursday + ',' +
            "Friday:" + envelope.friday + ',' +
            "Saturday:" + envelope.saturday + ',' +
            "Sunday:" + envelope.sunday + "\r\n";

    file.unlinkSync("hour/hour.data")
    file.writeFileSync("hour/hour.data", data);
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
