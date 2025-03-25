const { validationResult } = require('express-validator');
const Product = require('../models/product'); 

exports.createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); 
    }

    try {
        const {
            name, description, price, discountPrice, countInStock, sku,
            category, brand, sizes, colors, collections, material, gender,
            images, isFeatured, isPublished, rating, numReviews, tags,
            metaTitle, metaDescription, metaKeywords, dimensions, weight
        } = req.body;

        const newProduct = new Product({
            name, description, price, discountPrice, countInStock, sku,category, brand, sizes, colors, collections, material, gender,
            images, isFeatured, isPublished, rating, numReviews, tags,
            user: req.user?.id || req.user, 
            metaTitle, metaDescription, metaKeywords, dimensions, weight
        });

        await newProduct.save();

        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params; 
        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedFields = req.body; 
        product = await Product.findByIdAndUpdate(id, updatedFields, { new: true });

        const formattedProduct = {
            _id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            discountPrice: product.discountPrice,
            countInStock: product.countInStock,
            sku: product.sku,
            category: product.category,
            brand: product.brand,
            sizes: product.sizes,
            colors: product.colors,
            collections: product.collections,
            material: product.material,
            gender: product.gender,
            images: product.images,
            isFeatured: product.isFeatured,
            isPublished: product.isPublished,
            rating: product.rating,
            numReviews: product.numReviews,
            tags: product.tags,
            user: product.user,
            metaTitle: product.metaTitle,
            metaDescription: product.metaDescription,
            metaKeywords: product.metaKeywords,
            dimensions: product.dimensions,
            weight: product.weight,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };

        res.status(200).json({ message: 'Product updated successfully', product: formattedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

module.exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        await Product.findByIdAndDelete(id);

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

module.exports.getAllProducts = async (req, res, next) => { 
    try {
        const { 
            collection, size, color, gender, minPrice, maxPrice, sortBy, 
            search, category, material, brand, limit 
        } = req.query;

        let query = {};

        if (collection && collection.toLowerCase() !== 'all') {
            query.collection = collection;
        }
        if (category && category.toLowerCase() !== 'all') {
            query.category = category;
        }
        if (material) {
            query.material = { $in: material.split(",") };
        }
        if (brand) {
            query.brand = { $in: brand.split(",") };
        }
        if (size) {
            query.sizes = { $in: size.split(",") };
        }
        if (color) {
            query.colors = { $in: color };
        }
        if (gender) {
            query.gender = gender;
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // Sort by 
        let sort = {};
        if (sortBy) {
            switch (sortBy) {
                case 'priceAsc':
                    sort = { price: 1 };
                    break;
                case 'priceDesc':
                    sort = { price: -1 };    
                    break;
                case 'popularity':
                    sort = { rating: -1 };
                    break;
                default:
                    break;
            }
        }  

        let product = await Product.find(query)
            .sort(sort) 
            .limit(Number(limit) || 0);

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error getting all products', error: error.message });
    }
};

module.exports.bestSeller = async (req,res,next)=> {
    try {
       const bestseller = await Product.findOne().sort({rating:-1})
       if(bestseller){
        res.json(bestseller)
       }else {
        res.status(404).json({message : "no best seller found"})
       }
    } catch (error) {
        console.error(error)
        res.status(500).json({message : "server error"})
    }
}

module.exports.newArrival = async (req,res,next)=>{
    try {
        const newArrivals = await Product.find().sort({createAt:-1})
        res.json(newArrivals)
    } catch (error) {
        console.error(error)
        res.status(500).json({message : "server error"})

    }

}


module.exports.getOne = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const product = await Product.findById(id); 
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product); 
    } catch (error) {
        next(error);
    }
};

module.exports.getSimilar = async (req,res,next)=> {
    const {id} = req.params;
    try {
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const similarProducts = await Product.find({
            id : {$ne : id},
            gender : product.gender,
            category : product.category
        }).limit(4)
        res.json(similarProducts)
    } catch (error) {
        console.error(error)
        res.status(500).json("server error")
    }
}

