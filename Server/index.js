//var http = require('http');
//var httpDispatch = require('httpdispatcher');

const express = require('express')
const bodyParser = require('body-parser');

const app = express();


app.use((request, response, next) => {
    response.append('Access-Control-Allow-Origin', ['*']);
    response.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

var crypto = require("crypto-js");
var file = require('fs');
var url = require('url');

// Constants
var HOSTNAME = '127.0.0.1';
var PORT = 9595;
var KEY = '1234567890'

/*************************************************************************************************************

    SOFTWARE

*************************************************************************************************************/
// GET
app.get("/api/v1.0/software", (request, response) => {
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
app.get("/api/v1.0/account", (request, response) => {

  var envelope = request.query;
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
      response.json({ result: false, exception: err.message });
  }finally{
    response.json({ result: outcome });
  }

});

// POST
app.post("/api/v1.0/account", (request, response) => {

    var envelope = request.body;
    var outcome = false

    console.log("%s:%s account creation requested", envelope.user, envelope.password);

    try{

      data = envelope.user + ',' + envelope.password + ",valid\r\n";
      file.appendFileSync("account/account.data", data);
      outcome = true

    }catch(err){
        response.json({ result: false, exception: err.message });
    }finally{
      response.json({ result: outcome });
    }
});

/*************************************************************************************************************

    RESERVATION

*************************************************************************************************************/
// DELETE
app.delete("/api/v1.0/reservation/:telephone", (request, response) => {

  var outcome = false;

  console.log("Reservation delete requested for telephone: %s", request.params.telephone);

  try{
    data = "";

    contents = file.readFileSync('reservation/reservation.data', 'utf8');
    contents.split(/\r?\n/).forEach(line =>  {
      reservation = line.split(',')

      if (reservation.length == 5 ) {
          if ( request.params.telephone != reservation[3] ){
            data += line + '\r\n';
          }
      }
    });

    file.unlinkSync("reservation/reservation.data")
    file.writeFileSync("reservation/reservation.data", data);

    outcome = true;

  }catch(err){
    response.json({ result: false, exception: err.message });
  }finally{
    response.json({ result: outcome });
  }
});

// GET
app.get("/api/v1.0/reservation", (request, response) => {

  var outcome = []

  console.log("Reservations requested");

  try{
    contents = file.readFileSync('reservation/reservation.data', 'utf8');
    contents.split(/\r?\n/).forEach(line =>  {
      reservation = line.split(',')

      if (reservation.length == 5 ) {
          outcome.push({
            "date": reservation[0],
            "time": reservation[1],
            "name": reservation[2],
            "telephone": reservation[3],
            "email": reservation[4]
          });
      }
    });

  }catch(err){
      response.json({ result: [], exception: err.message });
  }finally{
    response.json({ result: outcome });
  }
});

// POST
app.post("/api/v1.0/reservation", (request, response) => {

  var envelope = request.body;
  var outcome = false

  console.log("Reservation request: %s <%s>", envelope.name, envelope.email);

  try{

    // Availability
    var availability = file.readFileSync('hour/hour.data', 'utf8');
    availability = availability.split(/\r?\n/)[0].split(',');

    // Proposed Date and Time
    var calendar = envelope.date.split('-')
    var time_given = 0;

    if ( (envelope.time).includes('PM') ){
      time_given = 12 + parseInt((envelope.time).replace(' PM', ''));
    }else{
      time_given = parseInt((envelope.time).replace(' PM', ''));
    }

    var reservation_date = new Date (parseInt(calendar[0]), parseInt(calendar[1]) -1, parseInt(calendar[2]), time_given);
    var day_of_week = reservation_date.getDay();

    // Restaurant availability
    var open_between = availability[day_of_week].split(':')[1];

    // Start
    var start_hour = open_between.split('-')[0].trim().split(' ');
    if( start_hour[1] == 'PM'){
      time_given = 12 + parseInt(start_hour[0]);
    }else{
      time_given = parseInt(start_hour[0]);
    }
    var temp_start = new Date(parseInt(calendar[0]), parseInt(calendar[1]) -1, parseInt(calendar[2]), time_given);

    // End
    var end_hour = open_between.split('-')[1].trim().split(' ');
    if( end_hour[1] == 'PM'){
      time_given = 12 + parseInt(end_hour[0]);
    }else{
      time_given = parseInt(end_hour[0]);
    }
    var temp_end = new Date(parseInt(calendar[0]), parseInt(calendar[1]) -1, parseInt(calendar[2]), time_given);

    if( reservation_date >= temp_start && reservation_date <= temp_end ){
          data = envelope.date + ',' + envelope.time + "," + envelope.name + ',' + envelope.telephone + ',' + envelope.email + "\r\n";
          file.appendFileSync("reservation/reservation.data", data);
          outcome = true

          console.log("Reservation stored successfully");
    }else{
      console.log('Restaurant is closed during requested reservation time!')
    }

  }catch(err){
      response.json({ result: false, exception: err.message });
  }finally{
    response.json({ result: outcome });
  }

});

/*************************************************************************************************************

    HOUR

*************************************************************************************************************/
// GET
app.get("/api/v1.0/hour", (request, response) => {
  var outcome = {};

  console.log("Hours requested");

  try{
    contents = file.readFileSync('hour/hour.data', 'utf8');
    contents = contents.split(/\r?\n/);

    if (contents.length > 0) {
      data = contents[0].split(',')
      outcome = {
        "Sunday" : data[0].split(':')[1],
        "Monday" : data[1].split(':')[1],
        "Tuesday" : data[2].split(':')[1],
        "Wednesday" : data[3].split(':')[1],
        "Thursday" : data[4].split(':')[1],
        "Friday" : data[5].split(':')[1],
        "Saturday" : data[6].split(':')[1],
      }
    }

  }catch(err){
      response.json({ result: {}, exception: err.message });
  }finally{
    response.json({ result: outcome });
  }
});

// POST
app.post("/api/v1.0/hour", (request, response) => {

  var envelope = request.body;
  var outcome = false

  console.log("Restaurant hours updated");

  try{

    data =  "Sunday:" + envelope.sunday + ',' +
            "Monday:" + envelope.monday + ',' +
            "Tuesday:" + envelope.tuesday + "," +
            "Wednesday:" + envelope.wednesday + ',' +
            "Thursday:" + envelope.thursday + ',' +
            "Friday:" + envelope.friday + ',' +
            "Saturday:" + envelope.saturday + ',' + "\r\n";

    file.unlinkSync("hour/hour.data")
    file.writeFileSync("hour/hour.data", data);
    outcome = true

  }catch(err){
      response.json({ result: false, exception: err.message });
  }finally{
    response.json({ result: outcome });
  }
});

app.listen(PORT, () => {
  console.log(`Server instance initialized at ${HOSTNAME}:${PORT}`)
});
