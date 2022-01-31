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
        console.log(request.url);
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        dispatch.dispatch(request, response)
    }catch(err){
        console.log(err);
    }
}

// Router Map
dispatch.onGet("/api/v1.0/software", function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});

    // Read Code File
    file.readFile('ui.js', 'utf8', function(err, contents){
        var encrypted_text = crypto.AES.encrypt(contents, KEY).toString();
        console.log("File Contents Encrypted ...")
        response.end(encrypted_text);
    });
});

// Router Object Instantiation
var server = http.createServer(routerEngine);

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server instance initialized at ${HOSTNAME}:${PORT}`)
})
