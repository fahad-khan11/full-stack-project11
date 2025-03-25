const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require('../middleware/authMiddleware')
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password must be at least 6 characters"),
  ],
  userController.registerUser
);

router.post (
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password must be at least 6 characters")
  ],
  userController.loginUser
)


router.get('/profile',authMiddleware.authUser,userController.getProfile)
module.exports = router; 
