const mongoose = require("mongoose");
const Cart= require("../models/cart");
const Product = require("../models/product");
const Checkout = require("../models/checkout");
const Order = require("../models/order");


module.exports.getOrders = async(req,res,next)=>{
    try {
        const orders = await Order.find({user:req.user._id}).sort({
            createdAt:-1,
        })
        res.json(orders)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server error"})
    }
}

module.exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate("user", "name email");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
