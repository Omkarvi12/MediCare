const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

// ==========================
// Upload Image to Cloudinary
// ==========================
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "medicare/products",
                resource_type: "image"
            },
            (error, result) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }

            }
        );

        stream.end(buffer);
    });
};


// ==========================
// Add Product
// ==========================
const addProduct = async (req, res) => {

    try {

        const {
            name,
            description,
            category,
            brand,
            manufacturer,
            price,
            stock,
            expiryDate,
            prescriptionRequired
        } = req.body;


        // ==========================
        // Required Fields
        // ==========================

        if (
            !name ||
            !description ||
            !category ||
            !brand ||
            !manufacturer ||
            price === undefined ||
            stock === undefined ||
            !expiryDate
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });

        }


        // ==========================
        // Validate Price
        // ==========================

        if (Number(price) < 0) {

            return res.status(400).json({
                success: false,
                message: "Price cannot be negative"
            });

        }


        // ==========================
        // Validate Stock
        // ==========================

        if (Number(stock) < 0) {

            return res.status(400).json({
                success: false,
                message: "Stock cannot be negative"
            });

        }


        // ==========================
        // Image Required
        // ==========================

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Product image is required"
            });

        }


        // ==========================
        // Upload Image to Cloudinary
        // ==========================

        const uploadedImage =
            await uploadToCloudinary(
                req.file.buffer
            );


        // ==========================
        // Create Product
        // ==========================

        const product = await Product.create({

            name: name.trim(),

            description: description.trim(),

            category: category.trim(),

            brand: brand.trim(),

            manufacturer: manufacturer.trim(),

            price: Number(price),

            stock: Number(stock),

            image: uploadedImage.secure_url,

            expiryDate,

            prescriptionRequired:
                prescriptionRequired === "true"

        });


        // ==========================
        // Success Response
        // ==========================

        return res.status(201).json({

            success: true,

            message: "Product Added Successfully",

            product

        });

    } catch (error) {

        console.error(
            "Add Product Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ==========================
// Get All Products
// ==========================
const getProducts = async (req, res) => {

    try {

        const products =
            await Product.find().sort({
                createdAt: -1
            });

        return res.status(200).json({

            success: true,

            totalProducts: products.length,

            products

        });

    } catch (error) {

        console.error(
            "Get Products Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ==========================
// Get Single Product
// ==========================
const getSingleProduct = async (req, res) => {

    try {

        const product =
            await Product.findById(
                req.params.id
            );

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product Not Found"

            });

        }


        return res.status(200).json({

            success: true,

            product

        });

    } catch (error) {

        console.error(
            "Get Single Product Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ==========================
// Update Product
// ==========================
const updateProduct = async (req, res) => {

    try {

        const product =
            await Product.findById(
                req.params.id
            );

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product Not Found"

            });

        }


        // ==========================
        // Update Normal Fields
        // ==========================

        const {
            name,
            description,
            category,
            brand,
            manufacturer,
            price,
            stock,
            expiryDate,
            prescriptionRequired
        } = req.body;


        if (name !== undefined) {

            product.name =
                name.trim();

        }


        if (description !== undefined) {

            product.description =
                description.trim();

        }


        if (category !== undefined) {

            product.category =
                category.trim();

        }


        if (brand !== undefined) {

            product.brand =
                brand.trim();

        }


        if (manufacturer !== undefined) {

            product.manufacturer =
                manufacturer.trim();

        }


        if (price !== undefined) {

            if (Number(price) < 0) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Price cannot be negative"

                });

            }

            product.price =
                Number(price);

        }


        if (stock !== undefined) {

            if (Number(stock) < 0) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Stock cannot be negative"

                });

            }

            product.stock =
                Number(stock);

        }


        if (expiryDate !== undefined) {

            product.expiryDate =
                expiryDate;

        }


        if (
            prescriptionRequired !== undefined
        ) {

            product.prescriptionRequired =
                prescriptionRequired === "true";

        }


        // ==========================
        // Update Image
        // ==========================

        if (req.file) {

            const uploadedImage =
                await uploadToCloudinary(
                    req.file.buffer
                );

            product.image =
                uploadedImage.secure_url;

        }


        // ==========================
        // Save Product
        // ==========================

        await product.save();


        return res.status(200).json({

            success: true,

            message:
                "Product Updated Successfully",

            product

        });

    } catch (error) {

        console.error(
            "Update Product Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ==========================
// Delete Product
// ==========================
const deleteProduct = async (req, res) => {

    try {

        const product =
            await Product.findByIdAndDelete(
                req.params.id
            );

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product Not Found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Product Deleted Successfully"

        });

    } catch (error) {

        console.error(
            "Delete Product Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ==========================
// Search Products
// ==========================
const searchProducts = async (req, res) => {

    try {

        const keyword =
            req.query.keyword || "";


        const products =
            await Product.find({

                name: {
                    $regex: keyword,
                    $options: "i"
                }

            });


        return res.status(200).json({

            success: true,

            totalProducts: products.length,

            products

        });

    } catch (error) {

        console.error(
            "Search Products Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ==========================
// Export
// ==========================

module.exports = {

    addProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    searchProducts

};