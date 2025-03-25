const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new userModel({ name, email, password });
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
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid password" });
  }
  const payload = { user: { id: user._id, role: user.role } };

  const token = jwt.sign(payload, process.env.JWT_SECRET || "233343234", {
    expiresIn: "7h",
  });

  return res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
};

module.exports.getProfile = async (req,res,next) => {
  res.status(200).json(req.user);
}

