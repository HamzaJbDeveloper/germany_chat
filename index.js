const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
app.use(express.json());
app.use(cors());
const path = require("path");
const server = http.createServer(app);

//init public route


//db connection
const {connectToDB}=require("./database/connect");

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();

module.exports=io;

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user joining
  socket.on("join", (user_id) => {
    if (!onlineUsers.has(user_id)) {
      onlineUsers.set(user_id, socket.id); // Store user_id and socket.id
    }
    console.log(`${user_id} joined. Online users count: ${onlineUsers.size}`);
    io.emit("update_front_online_users", onlineUsers.size); // Use io.emit to send to all clients
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    for (let [user_id, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(user_id);
        console.log(`User ${user_id} disconnected. Online users count: ${onlineUsers.size}`);
        io.emit("update_front_online_users", onlineUsers.size); // Broadcast updated user count
        break;
      }
    }
  });
});


// main routing system
app.use(express.static(path.join(__dirname,'public')));
app.get("*",(req, res, next)=>{
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
app.use("/api",require("./routes/index"));


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`The server is running on PORT ${PORT}`);
  connectToDB()
  
});
