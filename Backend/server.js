const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv")
const app = express();
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const subscribeRoutes = require('./routes/subscribeRoute');
const adminRoutes = require('./routes/adminRoutes');
const producAdmintRoutes = require('./routes/productAdminRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');


const cartRoutes = require('./routes/cartRoutes')
 const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cors());
dotenv.config()
const PORT = process.env.PORT || 3000;
connectDB()
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser());


app.use('/users',userRoutes)
app.use('/products',productRoutes)
app.use('/cart',cartRoutes)
app.use('/checkout',checkoutRoutes)
app.use('/orders',orderRoutes)
app.use('/upload',uploadRoutes)
app.use('/subscribe',subscribeRoutes)

// admin
app.use('/admin',adminRoutes)
app.use('/admin',producAdmintRoutes)
app.use('/admin',adminOrderRoutes)

app.get('/',(req,res)=>{
    res.send("API is running")
})


app.listen(PORT,()=>{
    console.log(`server is runing on the http://localhost:${PORT}`);
    
})