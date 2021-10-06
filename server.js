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



io.on("connection", (socket) => {
    try{
        // Identifies mani socket (socket that plays music)
        socket.on("main_auth",(arg) => {
            socket.join("main_sockets");
        });

        // Identifies mani socket (socket that plays music)
        socket.on("client_auth",(arg) => {
            socket.join("clients");
        });

        //CLIENT MTHODS
        socket.on("requestData", (arg) =>{ socket.emit('data', JSON.stringify(videoQueue)); });
        socket.on("addVideo", (url) =>{
            let video = videoQueue.addVideo(url);
            if(video != null)
            {
                storedVideos[video.videoCode] = video;
                fs.writeFile('./storedData.json', JSON.stringify(storedVideos),() =>{

                });
            }            
            io.local.emit('data', JSON.stringify(videoQueue)); 
        });

        socket.on("addRandomVideos", (num) =>{
            addRandomVideos(num);
            io.local.emit('data', JSON.stringify(videoQueue)); 
            
        });

        

        socket.on("removeVideo", (videoID) =>{ 
            videoQueue.removeVideo(videoID); 
            io.local.emit('data', JSON.stringify(videoQueue)); 
            if(videoQueue.videos.length == 0){
                addRandomVideos(1);
                io.local.emit('data', JSON.stringify(videoQueue));
            }
        });
        socket.on("stop", (arg) => { io.local.emit('stop',''); })
        socket.on("start", (arg) => { io.local.emit('start',''); })
        socket.on("mute", (arg) => { io.local.emit('mute',''); })
        socket.on("unmute", (arg) => { io.local.emit('unmute',''); })
        socket.on("move", (arg) => { io.local.emit('move',arg); })
        socket.on("volume", (arg) => { io.local.emit('volume',arg); })
        socket.on("next", (arg) => { io.local.emit('next',''); })

        //MAIN SOCKET METHODS
        socket.on("currData", (_currVideo) =>{ 

            io.local.emit("newCurrData", _currVideo);
        });
    }catch(e){ console.log(e); }
});

  


//SOCKET STARTUP
httpServer.listen(PORT_SOCKET);
console.log('Listening on port '+ PORT_SOCKET);