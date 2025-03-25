const mongoose = require('mongoose')

const connect_DB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('db connected successfully...');
        
    } catch (error) {
        console.error('mongodb connection failed',error)
        process.exit(1)
    }
}

module.exports = connect_DB