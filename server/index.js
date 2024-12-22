const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
// require("dotenv").config();  // No need to use when using launch.json
const uri = process.env.ATLAS_URI;
app.use(express.json({ limit: "50mb" })); // Set limit as needed
app.use(cors());

const userRoute = require("./routes/userRoute");

const chatRoute = require("./routes/chatRoute");

const messageRoute = require("./routes/messageRoute");

// Here when we are mounting the express.router in express instance before doing that it should
app.use("/api/users", userRoute);

app.use("/api/chats", chatRoute);

app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("welcome to chat api");
});

app.listen(port, () => {
  console.log(`Server is listening on port : ${port}`);
});

mongoose
  .connect(uri, {})
  .then((res) => {
    global.connection = mongoose.connection;
    console.log("Mongodb connection successful");
  })
  .catch((error) => {
    console.error("Mongodb connection failed", error.message);
  });
