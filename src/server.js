import http from "http";
//import WebSocket from "ws";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));


app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

//app.listen(3000, handleListen);

const httpServer = http.createServer(app);  //http 서버
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket.on("enter_room", (msg, done) => {
        console.log(msg);
        setTimeout(() => {
            done();
        }, 1000);
    //console.log(socket);
    });
});

/* 

// 아래 코드는 websocket ⭐️

// function handleConnection(socket) {
//     console.log(socket);
// }
// wss.on("connection", handleConnection);
// function onSocketClose() {
//     console.log("Disconnected from the Browser ❌");
// }
// function onSocketMessage(message) {
//     console.log(message);
// }

const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    //console.log(socket);
    console.log("Connected to Browser ✅");
    socket.on("close", onSocketClose);
    socket.on("message", (msg) => {
        //console.log(message);
        const message = JSON.parse(msg);
        //console.log(parsed, message.toString());
        switch (message.type) {
            case "new_message" :
                sockets.forEach((aSocket) => 
                    aSocket.send(`${socket.nickname} : ${message.payload}`)
                );
            break;
            case "nickname" :
                //console.log(message.payload);
                socket["nickname"] = message.payload;
            break;
        }
        //socket.send(message);
        //console.log(message.toString('utf8'))
    });
    //socket.send("hello");
});

*/

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);

{
    type: "message";
    payload: "hello";
}

{
    type: "nickname";
    payload: "nico";
}