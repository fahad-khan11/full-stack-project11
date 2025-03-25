const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {roleUser} = require('../middleware/authMiddleware');
const orderController = require('../controllers/order.controller')

const router = express.Router()

router.get("/my-orders",authMiddleware.authUser,orderController.getOrders)

router.get("/:id",authMiddleware.authUser,orderController.getOrderById)


module.exports = router