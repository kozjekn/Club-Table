const Gpio = require('onoff').Gpio;
const but_hand = new Gpio(4, 'in', 'both'); 
const but_drink = new Gpio(17, 'in', 'both'); 

const fs = require('fs');
const httpServer = require("http").createServer(function (req, res) {
    
    fs.readFile('./wwwroot/index.html', function (err,data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
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