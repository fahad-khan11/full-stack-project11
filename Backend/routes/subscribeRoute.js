const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {roleUser} = require('../middleware/authMiddleware');
const orderController = require('../controllers/subscribe.controller')

const router = express.Router();

router.post('/',orderController.subscribe)


module.exports = router;