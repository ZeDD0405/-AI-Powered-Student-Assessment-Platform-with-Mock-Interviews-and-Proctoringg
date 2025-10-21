const FormDataModel = require('../models/FormData');

// ---------------- Registration ----------------
const register = async (req, res) => {
    const { rollNo, name, password, confirmPassword } = req.body;

    // Validate input
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

        const newUser = new FormDataModel({ rollNo, name, password });
        await newUser.save();

        return res.status(201).json({
            message: "Registration successful",
            user: { rollNo: newUser.rollNo, name: newUser.name }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

// ---------------- Login ----------------
const login = async (req, res) => {
    const { rollNo, password } = req.body;

    if (!rollNo || !password) {
        return res.status(400).json({ error: "Please provide roll number and password" });
    }

    try {
        const student = await FormDataModel.findOne({ rollNo });
        if (!student) {
            return res.status(400).json({ error: "Invalid roll number or password" });
        }

        const isMatch = await student.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid roll number or password" });
        }

        return res.status(200).json({
            message: "Login successful",
            user: { rollNo: student.rollNo, name: student.name }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

module.exports = { register, login };
