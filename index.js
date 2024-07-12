import http from 'http'; // For creating the server
import { Server } from 'socket.io'; // For WebSocket communication
import dotenv from 'dotenv'; // For loading environment variables

dotenv.config(); // Load environment variables from .env file

// Create a new HTTP server
const server = http.createServer();

// Create a new Socket.IO server and attach it to the HTTP server
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000", // Local development URL
      "https://669116e03b2933032ce88821--guileless-otter-82d908.netlify.app" // Production frontend URL
    ],
    methods: ["GET", "POST"] // Allowed HTTP methods
  }
});

// Set up the Socket.IO event listeners
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`); // Log when a user connects

  // Emit the user's ID to themselves
  socket.emit("me", socket.id);

  // Handle when a user disconnects
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`); // Log when a user disconnects
    socket.broadcast.emit("callEnded"); // Notify other users that the call has ended
  });

  // Handle calling another user
  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name });
  });

  // Handle answering a call
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

// Start the server on port 5000
const PORT = 7000; // Port number for the video call server
server.listen(PORT, () => {
  console.log(`Video call server is running on port ${PORT}`); // Log that the server is running
});
