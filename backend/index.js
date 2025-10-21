const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require('./models/FormData');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/practice_mern', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// ---------------- Registration ----------------
app.post('/register', async (req, res) => {
    const { rollNo, name, password, confirmPassword } = req.body;

    // Validate fields
    if (!rollNo || !name || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        // Check if roll number already exists
        const existingUser = await FormDataModel.findOne({ rollNo });
        if (existingUser) {
            return res.status(400).json({ error: "Roll number already registered" });
        }

        // Create new user
        const newUser = await FormDataModel.create({ rollNo, name, password });

        res.status(201).json({
            message: "Registration successful",
            user: { rollNo: newUser.rollNo, name: newUser.name }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// ---------------- Login ----------------
app.post('/login', async (req, res) => {
    const { rollNo, password } = req.body;

    if (!rollNo || !password) {
        return res.status(400).json({ error: "Roll number and password are required" });
    }

    try {
        const user = await FormDataModel.findOne({ rollNo });

        if (!user) {
            return res.status(404).json({ error: "No records found for this roll number" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Wrong password" });
        }

        res.json({
            message: "Login successful",
            user: { rollNo: user.rollNo, name: user.name }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Start server
app.listen(3001, () => {
    console.log("Server listening on http://127.0.0.1:3001");
});
