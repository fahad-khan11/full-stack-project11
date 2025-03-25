const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { roleUser } = require("../middleware/authMiddleware");
const adminProductController = require("../controllers/adminProduct.controller");

const router = express.Router();

router.get(
    "/getAllProducts",
    authMiddleware.authUser,
    roleUser(["admin"]),
    adminProductController.getAllProducts
);

router.post(
    "/products",
    authMiddleware.authUser,
    roleUser(["admin"]),
    adminProductController.createProduct
);

router.put(
    "/products/:id",
    authMiddleware.authUser,
    roleUser(["admin"]),
    adminProductController.updateProduct
);

router.delete(
    "/products/:id",
    authMiddleware.authUser,
    roleUser(["admin"]),
    adminProductController.deleteProduct
);

module.exports = router;
