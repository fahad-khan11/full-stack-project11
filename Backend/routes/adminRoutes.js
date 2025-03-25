const express = require('express');  
const authMiddleware = require('../middleware/authMiddleware');
const { roleUser } = require('../middleware/authMiddleware');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.get('/users', authMiddleware.authUser, roleUser(['admin']), adminController.getAdmin);

router.post('/create', authMiddleware.authUser, roleUser(['admin']), adminController.addUser);

router.put('/users/:id', authMiddleware.authUser, roleUser(['admin']), adminController.updateUser);

router.delete('/users/:id', authMiddleware.authUser, roleUser(['admin']), adminController.deleteUser);




module.exports = router;
