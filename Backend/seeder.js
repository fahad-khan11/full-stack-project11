const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Product = require('./models/product');
const User= require('./models/user');
const Cart = require('./models/cart');
const products = require('./data/products');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();


        // Hash the password before creating an admin user
        const hashedPassword = await bcrypt.hash('123456', 10);

        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: hashedPassword, 
            role: "admin",
        });

        // Assign the default user ID to each product
        const userID = createdUser._id;
        const sampleProducts = products.map((product) => {
            return { ...product, user: userID }; 
        });

        await Product.insertMany(sampleProducts);
    
        console.log('Product data seeded successfully');
        
        process.exit(0); 
    } catch (error) {
        console.error('Error seeding the data:', error);
        process.exit(1); 
    }
};

seedData();
