require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const FormDataModel = require("./models/FormData");
const interviewRoutes = require("./routes/interviewRoutes");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ allow frontend
    methods: ["GET", "POST"],
  })
);

// ---------------- MongoDB Connection ----------------
mongoose
  .connect("mongodb://127.0.0.1:27017/practice_mern", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ---------------- Registration ----------------
app.post("/register", async (req, res) => {
  const { rollNo, name, password, confirmPassword } = req.body;

  if (!rollNo || !name || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const existingUser = await FormDataModel.findOne({ rollNo });
    if (existingUser) {
      return res.status(400).json({ error: "Roll number already registered" });
    }

    const newUser = await FormDataModel.create({ rollNo, name, password });

    res.status(201).json({
      message: "Registration successful",
      user: { rollNo: newUser.rollNo, name: newUser.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Login ----------------
app.post("/login", async (req, res) => {
  const { rollNo, password } = req.body;

  if (!rollNo || !password) {
    return res
      .status(400)
      .json({ error: "Roll number and password are required" });
  }

  try {
    const user = await FormDataModel.findOne({ rollNo });

    if (!user) {
      return res
        .status(404)
        .json({ error: "No records found for this roll number" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Wrong password" });
    }

    res.json({
      message: "Login successful",
      user: { rollNo: user.rollNo, name: user.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Gemini Mock Interview Routes ----------------
app.use("/api/interview", interviewRoutes);

// ---------------- Start Server ----------------
const PORT = 5000; // ✅ Changed to match frontend URL
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});
