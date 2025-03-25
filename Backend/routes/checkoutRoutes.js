const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {roleUser} = require('../middleware/authMiddleware');
const checkoutController = require('../controllers/checkout.controller')

const router = express.Router()

router.post('/',authMiddleware.authUser,checkoutController.createCheckout)

router.put('/:id/pay',authMiddleware.authUser,checkoutController.updateCheckout)

router.post('/:id/finalize',authMiddleware.authUser,checkoutController.finalizeCheckout)



module.exports = router