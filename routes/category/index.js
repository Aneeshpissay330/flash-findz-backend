const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../../controllers/category');
const authMiddleware = require('../../middlewares/auth'); // The middleware you provided

router.post('/', authMiddleware, createCategory);
router.get('/', authMiddleware, getAllCategories);
router.get('/:id', authMiddleware, getCategoryById);
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;
