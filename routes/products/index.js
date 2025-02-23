const express = require('express');
const router = express.Router();
const productController = require('../../controllers/products');
const authMiddleware = require('../../middlewares/auth');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() }); // For handling file uploads

// Routes
router.post('/', authMiddleware, upload.array('files'), productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', authMiddleware, upload.array('files'), productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
