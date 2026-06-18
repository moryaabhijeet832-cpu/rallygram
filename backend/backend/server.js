const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const authRoutes = require("./backend/models/backend/routes/authRoutes");
dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get("/", (req, res) => {
  res.send("Rallygram Backend is running");
});
const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    time: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_chat", async (chatName) => {
    try {
      const messages = await Message.find({ chat: chatName })
        .sort({ createdAt: 1 })
        .limit(100);

      socket.emit("old_messages", messages);
    } catch (error) {
      console.log("Old messages load error:", error);
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const savedMessage = await Message.create({
        chat: data.chat,
        text: data.text,
        sender: data.sender,
        time: data.time,
      });

      io.emit("receive_message", savedMessage);
    } catch (error) {
      console.log("Message save error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
