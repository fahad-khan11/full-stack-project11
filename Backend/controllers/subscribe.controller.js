const Subscribe = require('../models/subscriber'); 

module.exports.subscribe = async(req,res)=> {
    const {email} = req.body;
    if(!email){
        res.status(400).json({message:"email is required"})
    }
    try {
        let subscribe = await Subscribe.findOne({email})
        if(subscribe){
            res.status(404).json({message:"email is already in subscribed"})
        }
        
        subscribe = new Subscribe({email})
        await subscribe.save()
        res.status(201).json({message:"Successfully subscribed to the newsletter!"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"sever error"})
    }
}