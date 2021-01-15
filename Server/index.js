const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
const app = express();
const path = require("path");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "uploads")));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established succesfully");
});

const authRoutes = require("./routes/authRoute");

app.use("/api", authRoutes);


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
