import { createServer } from "http";
import { Server } from "socket.io";
import migrations from "./migrations.js";
// import ConnectionController from "./controllers/ConnectionController.js";
import MessageController from "./controllers/MessageController.js";
import cors from "cors";
import express from "express";
import os from "os";

const serverName = "Jupiter";

function getLocalIp() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      const { address, family, internal } = iface;
      if (family === "IPv4" && !internal) {
        return address;
      }
    }
  }

  return "localhost";
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

app.use(
  cors({
    origin: "*",
    methods: "*",
  })
);

// First we
migrations.run();

app.get("/", (req, res) => {
  res.send("Socket.io server is running");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  // Connection
  // ConnectionController.Connection(socket, io);
  // socket.on("disconnect", (data) =>
  //   ConnectionController.Disconnect(socket, io, data)
  // );

  // // Messages
  // socket.on("message:list", (data) => MessageController.List(socket, io, data));
  // socket.on("message:create", (data) =>
  //   MessageController.Create(socket, io, data)
  // );
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.emit("welcome", serverName);

  socket.on("message", async (msg) => {
    console.log(msg);
    MessageController.Create(msg)
      .then((msg) => {
        io.emit("message", msg);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  socket.on("messages", async () => {
    const messages = await MessageController.All();
    socket.emit("messages", messages);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://${getLocalIp()}:${PORT}`);
});
