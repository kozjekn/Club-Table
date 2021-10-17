const Gpio = require('onoff').Gpio;
const but_hand = new Gpio(4, 'in', 'both'); 
const but_drink = new Gpio(17, 'in', 'both'); 

const fs = require('fs');
const path = require('path');
const httpServer = require("http").createServer(function (request, response) {
    
    var filePath = './wwwroot' + request.url;
    if (filePath == './wwwroot/')
        filePath = './wwwroot/index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
});

const PORT_SOCKET = 3000;



const io = require("socket.io")(httpServer, {
    cors: {
        origin: '*',
    }
});

//SOCKET STARTUP
httpServer.listen(PORT_SOCKET);
console.log('Listening on port '+ PORT_SOCKET);


//EVENT
but_hand.watch(function (err, value) { 
    if (err) { //if an error
      console.error('There was an error', err); 
    return;
    }
    if(value) { io.local.emit("button", "handGame"); }
  });

but_drink.watch(function (err, value) { 
    if (err) { //if an error
      console.error('There was an error', err); 
    return;
    }
    if(value) { io.local.emit("button", "drinkigGame"); }
  });



 require('child_process').exec("chromium-browser http://localhost:3000 --kiosk");