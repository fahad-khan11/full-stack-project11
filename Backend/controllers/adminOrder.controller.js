const Order = require('../models/order')

module.exports.getAllOrders = async(req,res,next)=> {
    try {
        const orders = await Order.find({}).populate("user", "name email")

        res.status(200).json(orders)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"server error"})
    }
}

module.exports.getOrderByIdAndUpdate = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user","name email");
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = req.body.status || order.status;
        order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
        order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

        const updatedOrder = await order.save();
        res.json(updatedOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports.getOrderByIdAndDelete = async (req,res,next)=>{
    try {
        const {id}= req.params;
        const order = await Order.findByIdAndDelete(id)
        if(!order){
            return res.status(404).json({message : "order not found"})
        }
        res.status(201).json({message: "order deleted successfully"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"server error"})
    }
}