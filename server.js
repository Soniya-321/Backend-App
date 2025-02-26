require("dotenv").config();
const express = require("express");
const http = require("http"); // Required for WebSocket server
const { Server } = require("socket.io"); // Import Socket.io
const cors = require("cors");
const connectDB = require("./config/db");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
}); // Initialize WebSocket server



connectDB();

app.use(cors());
app.use(express.json());

app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);

app.use(errorHandler);

// WebSocket connection event
io.on("connection", (socket) => {
    console.log("🔗 New WebSocket connection");
  
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected");
    });
  });
  
  // Make io accessible globally for real-time updates
  app.set("io", io);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0" , () => console.log(`🚀 Server running on port ${PORT}`)); 
