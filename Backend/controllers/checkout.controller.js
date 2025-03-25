const mongoose = require("mongoose");
const Cart= require("../models/cart");
const Product = require("../models/product");
const Checkout = require("../models/checkout");
const Order = require("../models/order");

module.exports.createCheckout = async (req, res, next) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "No items to checkout" });
    }

    try {
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false,
        });

        console.log(`Checkout created for the user: ${req.user._id}`);
        res.status(200).json(newCheckout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports.updateCheckout = async (req, res, next) => {
    const { id } = req.params;
    const { paymentStatus, paymentDetails } = req.body;

    try {
        const checkout = await Checkout.findById(id);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        // If payment is completed, update status
        if (paymentStatus === "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            
            await checkout.save();

            return res.status(200).json(checkout);
        } else {
            return res.status(400).json({ message: "Invalid payment status" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports.finalizeCheckout = async(req,res,next)=> {
    try {
        const {id} = req.params
        const checkout = await Checkout.findById(id)
        if(!checkout){
            return res.status(404).json({message:"checkout not found"})
        }
        if(checkout.isPaid && !checkout.isFinalized){
            const finalOrder = await Order.create({
                user:checkout.user,
                orderItems:checkout.orderItems,
                shippingAddress:checkout.shippingAddress,
                paymentMethod:checkout.paymentMethod,
                totalPrice:checkout.totalPrice,
                isPaid: true,
                paidAt:checkout.paidAt,
                isDelivered:false,
                paymentStatus:"paid",
                paymentDetails:checkout.paymentDetails
            })
            checkout.isFinalized = true,
            checkout.finalizedAt = Date.now()
            await checkout.save()

            await Cart.findOneAndDelete({user : checkout.user})
            res.status(201).json(finalOrder)
        }else if(checkout.isFinalized){
            res.status(400).json({message:"checkout already finalized"})
        }
        else {
            res.status(400).json({message:"Checkout is not paid"})
        }

    } catch (error) { 
        console.error(error)
        res.status(500).json({message:"Server error"})
    }
}