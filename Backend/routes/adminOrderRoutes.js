const express = require('express');  
const authMiddleware = require('../middleware/authMiddleware');
const { roleUser } = require('../middleware/authMiddleware');
const adminOrderController = require('../controllers/adminOrder.controller');

const router = express.Router()

router.get('/getAllOrders',authMiddleware.authUser,roleUser(['admin']),adminOrderController.getAllOrders)

router.put('/getOrder/update/:id',authMiddleware.authUser,roleUser(['admin']),adminOrderController.getOrderByIdAndUpdate)

router.delete('/order/delete/:id',authMiddleware.authUser,roleUser(['admin']),adminOrderController.getOrderByIdAndDelete)


module.exports = router;