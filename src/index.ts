import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let count = 0;
interface User {
  socket: WebSocket;
  room: string;
}
let allSocket: User[] = [];
// [
//   { socket: socket, room: "room1" },
//   { socket: socket2, room: "room3" },
//   { socket: socket3, room: "room1" },
// ];

wss.on("connection", (socket: WebSocket) => {
  //@ts-ignore

  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
    if (parsedMessage.type === "join") {
      allSocket.push({
        socket,
        room: parsedMessage.payload.roomId,
      });
    }
    if (parsedMessage.type === "chat") {
      //@ts-ignore
      const currentUserRoom = allSocket.find((x) => x.socket == socket).room;
      for (let i = 0; i < allSocket.length; i++) {
        if (allSocket[i].room == currentUserRoom) {
          allSocket[i].socket.send(parsedMessage.payload.message);
        }
      }
    }
  });
  //   socket.on("close", () => {
  //     allSocket = allSocket.filter((x) => x != socket);
  //   });
});
