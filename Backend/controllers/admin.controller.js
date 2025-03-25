const mongoose = require("mongoose");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.getAdmin = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports.addUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const isUserAlreadyExist = await User.findOne({ email });
        if (isUserAlreadyExist) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword, role });
        const payload = { user: { id: user._id, role: user.role } };

        const token = jwt.sign(payload, process.env.JWT_SECRET || "233343234", {
            expiresIn: "7d",
        });

        await user.save();

        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
}

module.exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, role },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findOneAndDelete({ _id: id });
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}