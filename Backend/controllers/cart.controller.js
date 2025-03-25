const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Cart = require("../models/cart");
const Product = require("../models/product");

const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId: guestId });
  }
  return null;
};

// Fetch Cart
module.exports.getCart = async (req, res, next) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create Cart
module.exports.createCart = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation error", errors: errors.array() });
    }

    const { productId, quantity, size, color, guestId, userId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await getCart(userId, guestId);
    if (cart) {
      const existingProductIndex = cart.products.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.size === size &&
          item.color === color
      );

      if (existingProductIndex > -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0]?.url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0]?.url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });

      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Cart
module.exports.updateCart = async (req, res, next) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);

    if (!cart || !cart.products || !Array.isArray(cart.products)) {
      return res.status(404).json({ message: "Cart not found or products missing" });
    }

    if (!productId) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId && p.size === size && p.color === color
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1);
      }

      cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);

      await cart.save();
      return res.status(200).json({ message: "Cart updated successfully" });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete Cart Item
module.exports.deleteCart = async (req, res, next) => {
  const { productId, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId && p.size === size && p.color === color
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json({ message: "Cart item deleted successfully" });
    } else {
      return res.status(404).json({ message: "Product not found in the cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Merge Carts
module.exports.merge = async (req, res, next) => {
  const { guestId } = req.body;

  try {
    const userCart = await Cart.findOne({ user: req.user._id });
    const guestCart = await Cart.findOne({ guestId });

    if (!guestCart || guestCart.products.length === 0) {
      return res.status(400).json({ message: "Guest cart is empty" });
    }

    if (userCart) {
      // Merge guest cart into user cart
      guestCart.products.forEach((guestItem) => {
        const productIndex = userCart.products.findIndex(
          (item) =>
            item.productId.toString() === guestItem.productId.toString() &&
            item.size === guestItem.size &&
            item.color === guestItem.color
        );

        if (productIndex > -1) {
          // If product exists, update the quantity
          userCart.products[productIndex].quantity += guestItem.quantity;
        } else {
          // If product doesn't exist, add it to the cart
          userCart.products.push(guestItem);
        }
      });

      // Calculate total price
      userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

      // Save updated user cart
      await userCart.save();

      // Delete guest cart after merging
      await Cart.findOneAndDelete({ guestId });

      return res.status(200).json({ message: "Cart merged successfully", userCart });
    } else {
      // If no user cart exists, assign guest cart to user
      guestCart.user = req.user._id;
      await guestCart.save();

      return res.status(200).json({ cart: guestCart });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};