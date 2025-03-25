const express = require('express');
const { body } = require('express-validator'); 
const authMiddleware = require('../middleware/authMiddleware');
const cartController = require('../controllers/cart.controller');

const router = express.Router();

router.post(
  '/',
  authMiddleware.authUser,
  cartController.createCart
);

router.put(
  '/update',
  authMiddleware.authUser,
  cartController.updateCart
);

router.delete(
  '/delete',
  authMiddleware.authUser,
  cartController.deleteCart
);

router.get(
  '/getCart',
  authMiddleware.authUser,
  cartController.getCart
);

router.post(
  '/merge',
  authMiddleware.authUser,
  cartController.merge
);

module.exports = router;