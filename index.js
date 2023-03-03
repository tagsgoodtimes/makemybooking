import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./api/routes/auth.js";
import usersRoute from "./api/routes/users.js";
import hotelsRoute from "./api/routes/hotels.js";
import roomsRoute from "./api/routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    // console.log("Connected to DB");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  // console.log("mongoDB disconnected!");
});

mongoose.connection.on("connected", () => {
  // console.log("mongoDB connected!");
});

// middlewares

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
  // console.log("im a middleware!");
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json(errorMessage);
});

// app.post("/api/auth/register", async (req, res) => {
//   const { username, email, country, city, phone, password } = req.body;

//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   const user = new User({
//     username,
//     email,
//     country,
//     city,
//     phone,
//     password: hashedPassword,
//   });

//   try {
//     await user.save();
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
//     res.status(201).json({ token });
//   } catch (err) {
//     console.error(err);
//     res.status(400).send("Error registering user");
//   }
// });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static files
app.use(express.static(path.join(__dirname, './frontend/build')));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/build/index.html'));
})

app.use(express.static(path.join(__dirname, './admin_dashboard/build')));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, './admin_dashboard/build/index.html'));
})

app.listen(8800, () => {
  connect();
  // console.log("Connected to backend! on port 8800");
});
