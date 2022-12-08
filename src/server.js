import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));


app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
//app.listen(3000, handleListen);

const server = http.createServer(app);  //http 서버
const wss = new WebSocket.Server({ server });

// function handleConnection(socket) {
//     console.log(socket);
// }
// wss.on("connection", handleConnection);

function onSocketMessage(message) {
    console.log(message);
}

wss.on("connection", (socket) => {
    //console.log(socket);
    console.log("Connected to Browser ✅");
    socket.on("close", onSocketMessage);
    socket.on("message", (message) => {
        //console.log(message);
        console.log(message.toString('utf8'))
    });
    socket.send("hello");
});

server.listen(3000, handleListen);