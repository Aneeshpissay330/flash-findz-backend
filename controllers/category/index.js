const Category = require('../../models/Category');
const uploadImage = require('../../config/imagekit');
const multer = require('multer');

const upload = multer().single('image'); // Multer for handling image upload

// Create Category
exports.createCategory = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ message: 'Image upload error', error: err });

        try {
            const { name, description, parentCategory } = req.body;
            const createdBy = req.user._id; // Get user ID from authMiddleware

            // Check if category already exists
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({ message: 'Category already exists' });
            }

            let imageUrl = '';
            if (req.file) {
                // Upload image to ImageKit
                const uploadedImage = await uploadImage(req.file, '/categories');
                imageUrl = uploadedImage.url;
            }

            // Create category
            const category = new Category({ name, description, image: imageUrl, parentCategory, createdBy });
            await category.save();

            res.status(201).json({ message: 'Category created successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    });
};
// Get All Categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('parentCategory', 'name').populate('createdBy', 'firstName lastName email');
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Single Category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('parentCategory', 'name').populate('createdBy', 'firstName lastName email');
        if (!category) return res.status(404).json({ message: 'Category not found' });

        res.status(200).json({ category });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update Category
exports.updateCategory = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ message: 'Image upload error', error: err });

        try {
            const { name, description, parentCategory, status } = req.body;
            const category = await Category.findById(req.params.id);
            if (!category) return res.status(404).json({ message: 'Category not found' });

            let imageUrl = category.image;
            if (req.file) {
                // Upload new image to ImageKit
                const uploadedImage = await imagekit.upload({
                    file: req.file.buffer.toString('base64'),
                    fileName: `${Date.now()}_${req.file.originalname}`,
                    folder: '/categories'
                });
                imageUrl = uploadedImage.url;
            }

            // Update category
            category.name = name || category.name;
            category.description = description || category.description;
            category.image = imageUrl;
            category.parentCategory = parentCategory || category.parentCategory;
            category.status = status || category.status;
            await category.save();

            res.status(200).json({ message: 'Category updated successfully', category });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    });
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        await category.deleteOne();
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
