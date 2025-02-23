const Product = require('../../models/Products');
const uploadImage = require('../../config/imagekit'); // ImageKit service

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, status } = req.body;
    const createdBy = req.user._id; // Comes from authMiddleware

    // Upload images to ImageKit
    let images = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const uploadedImage = await uploadImage(file, '/products')
        images.push(uploadedImage.url);
      }
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      status,
      createdBy,
      images
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name').populate('createdBy', 'firstName lastName');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name').populate('createdBy', 'firstName lastName');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, status } = req.body;

    // Handle image updates
    let images = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const uploadedImage = await imageKit.upload({
          file: file.buffer.toString('base64'),
          fileName: `${Date.now()}-${file.originalname}`,
          folder: '/products'
        });
        images.push(uploadedImage.url);
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, stock, status, images },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
