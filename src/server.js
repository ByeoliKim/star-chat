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

function publicRooms() {
    //sids 에는 개인방, rooms 에는 개인방, 공개방이 다 있음.
    //rooms 가 sids 를 포함한다고 보면 됨.
    //공개방만 얻고 싶을 때는 rooms 에서 sids 를 빼면 된다.
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
    //wsServer.socketsJoin("announcement");
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(wsServer.sockets.adapter);
        console.log(`socket event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done(); // done() function 은 프론트에 있는 showRoom () 실행함.
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        // event 를 방금 참가한 방 안에 있는 모든 사람에게 emit 해 줌.
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("disconnecting", () => {
        //disconnecting event 는 socket이 방을 떠나기 바로 직전에 발생함.
        socket.rooms.forEach((room) => 
        socket.to(room).emit("bye", socket.nickname, countRoom(room) -1));
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    })
    socket.on("new_message", (msg, room, done) => {
        //어떤 방으로 message 를 보내야 하는지 알 수 있옹~
        //payload 는 내가 방금 받은 메시지가 될 거야~
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
        done();
        //done 을 호출했을 때, 프론트에서 코드를 실행할 거야~
    });
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));


    // console.log(socket.id);
    // console.log(socket.rooms);
    // console.log(socket.rooms);
    // setTimeout(() => {
    //     done("hello from the backend");
    //     done function 을 실행하면 백엔드에서 이 코드를 실행시키지 않음. (보안 문제)
    //     프론트에서 실행 버튼을 눌러 주는 거라고 보면 됨.
    // }, 5000);
    //console.log(socket);
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