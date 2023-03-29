//import relevent libaries 
const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const bodyParser = require("body-parser")
const PORT = 4000
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

//use CORS and body-parser middlewarein the Express app and an empty array to store user data
app.use(cors())
app.use(bodyParser.json())
let users = []

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)  
    socket.on("message", data => {
      socketIO.emit("messageResponse", data)
    })

    // listen for incoming "typing" events
    socket.on("typing", data => (
      socket.broadcast.emit("typingResponse", data)
    ))
    // listen for incoming "newUser" events and add the new user to the "users" array, then broadcast the updated user list to all connected 
    socket.on("newUser", data => {
      users.push(data)
      socketIO.emit("newUserResponse", users)
    })
 
    // listen for socket disconnections and remove the disconnected user from the "users" array
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
      users = users.filter(user => user.socketID !== socket.id)
      socketIO.emit("newUserResponse", users)
      socket.disconnect()
    });
});

// define a route for the root endpoint and return a JSON response
app.get("/api", (req, res) => {
  res.json({message: "Hello"})
});

// define a route for the "/api/username" endpoint
app.post("/api/username", (req, res) => {
  const { username } = req.body 
  users.push({ username, socketID: socket.id }) 
  socketIO.emit("newUserResponse", users) 
  res.json({ message: "Username added successfully" })
})
   
http.listen(process.env.PORT || PORT, () => {
    console.log(`Server listening on ${PORT}`);
});