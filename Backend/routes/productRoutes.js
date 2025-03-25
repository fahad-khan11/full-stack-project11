const express = require('express');
const { body } = require('express-validator');  
const authMiddleware = require('../middleware/authMiddleware');
const {roleUser} = require('../middleware/authMiddleware');

const productController = require('../controllers/product.controller');

const router = express.Router();

router.post(
    '/',
    authMiddleware.authUser,
    roleUser(['admin']),
    [
        body('name').notEmpty().withMessage('Name is required').trim(),
        body('description').notEmpty().withMessage('Description is required'),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('sku').notEmpty().withMessage('SKU is required'),
        body('category').notEmpty().withMessage('Category is required'),
        body('sizes').isArray().withMessage('Sizes must be an array'),
        body('colors').isArray().withMessage('Colors must be an array'),
        body('gender').isIn(['Men', 'Women', 'Unisex']).withMessage('Gender must be Men, Women, or Unisex'),
        body('images').isArray().withMessage('Images must be an array'),
    ],
    productController.createProduct
);

router.put(
    '/update/:id',
    authMiddleware.authUser,
    roleUser(['admin']),
    [
        body('name').optional().trim(),
        body('description').optional(),
        body('price').optional().isNumeric().withMessage('Price must be a number'),
        body('sku').optional(),
        body('category').optional(),
        body('sizes').optional().isArray().withMessage('Sizes must be an array'),
        body('colors').optional().isArray().withMessage('Colors must be an array'),
        body('gender').optional().isIn(['Men', 'Women', 'Unisex']).withMessage('Gender must be Men, Women, or Unisex'),
        body('images').optional().isArray().withMessage('Images must be an array'),
    ],
    productController.updateProduct
);

router.delete('/delete/:id',authMiddleware.authUser,roleUser(['admin']),productController.deleteProduct)

router.get('/getallproducts',productController.getAllProducts)

router.get('/best-seller',productController.bestSeller)
router.get('/new-arrival',productController.newArrival)

router.get('/:id',productController.getOne)

router.get('/similar/:id',productController.getSimilar)


module.exports = router;
