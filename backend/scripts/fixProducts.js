require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const cloudinary = require("../utils/cloudinary");

// ======================================================
// IMPORTANT
// ======================================================

// FIRST RUN = SAFE CHECK ONLY
const DRY_RUN = false;


// ======================================================
// MongoDB Connection
// ======================================================

const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");

    } catch (error) {

        console.error(
            "❌ MongoDB Connection Error:",
            error.message
        );

        process.exit(1);
    }
};


// ======================================================
// Normalize Product Name
// ======================================================

const normalizeName = (name = "") => {

    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

};


// ======================================================
// Cloudinary Image Check
// ======================================================

const isCloudinaryImage = (image = "") => {

    return image.startsWith(
        "https://res.cloudinary.com/"
    );

};


// ======================================================
// Local Image Check
// ======================================================

const localImageExists = (image = "") => {

    if (!image) {
        return false;
    }

    if (isCloudinaryImage(image)) {
        return true;
    }

    const uploadPath = path.join(
        __dirname,
        "..",
        "uploads",
        image
    );

    return fs.existsSync(uploadPath);

};


// ======================================================
// Product Priority
// ======================================================

const getProductScore = (product) => {

    let score = 0;

    // Cloudinary image
    if (
        isCloudinaryImage(product.image)
    ) {
        score += 100;
    }

    // Local image
    else if (
        localImageExists(product.image)
    ) {
        score += 50;
    }

    // Reviews
    score += Number(
        product.reviews || 0
    );

    // Rating
    score += Number(
        product.rating || 0
    );

    return score;
};


// ======================================================
// Find Duplicate Groups
// ======================================================

const findDuplicates = (products) => {

    const groups = new Map();

    for (const product of products) {

        const key =
            normalizeName(product.name);

        if (!groups.has(key)) {
            groups.set(key, []);
        }

        groups
            .get(key)
            .push(product);

    }

    return [...groups.entries()]
        .filter(
            ([, group]) =>
                group.length > 1
        );

};


// ======================================================
// Check Cart References
// ======================================================

const getCartReferences = async (
    productId
) => {

    return await Cart.find({
        product: productId
    });

};


// ======================================================
// Check Order References
// ======================================================

const getOrderReferences = async (
    productId
) => {

    return await Order.find({
        "items.product": productId
    });

};


// ======================================================
// Pexels Image Search
// ======================================================

const getPexelsImage = async (
    product
) => {

    if (!process.env.PEXELS_API_KEY) {

        throw new Error(
            "PEXELS_API_KEY is missing in .env"
        );

    }

    const query =
        `${product.name} medicine ${product.category}`;

    console.log(
        `🔎 Pexels Search: ${query}`
    );

    const response =
        await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(
                query
            )}&per_page=10`,
            {
                headers: {
                    Authorization:
                        process.env.PEXELS_API_KEY
                }
            }
        );

    if (!response.ok) {

        throw new Error(
            `Pexels API Error: ${response.status}`
        );

    }

    const data =
        await response.json();

    if (
        !data.photos ||
        data.photos.length === 0
    ) {

        return null;

    }

    const photo =
        data.photos.find(
            item =>
                item.src?.medium
        ) || data.photos[0];

    return photo.src.medium;

};


// ======================================================
// Download Image
// ======================================================

const downloadImage = async (
    url
) => {

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            "Image download failed"
        );

    }

    const arrayBuffer =
        await response.arrayBuffer();

    return Buffer.from(
        arrayBuffer
    );

};


// ======================================================
// Upload To Cloudinary
// ======================================================

const uploadToCloudinary = (
    buffer
) => {

    return new Promise(
        (resolve, reject) => {

            const stream =
                cloudinary.uploader.upload_stream(
                    {
                        folder:
                            "medicare/products",
                        resource_type:
                            "image"
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

        }
    );

};


// ======================================================
// SAFE DUPLICATE CLEANUP
// ======================================================

const cleanupDuplicates = async (
    duplicateGroups
) => {

    console.log(
        "\n=============================="
    );

    console.log(
        "🔍 SAFE DUPLICATE ANALYSIS"
    );

    console.log(
        "==============================\n"
    );


    let deleted = 0;
    let protectedProducts = 0;
    let cartMoved = 0;


    for (
        const [name, group]
        of duplicateGroups
    ) {

        const sorted =
            [...group].sort(
                (a, b) =>
                    getProductScore(b) -
                    getProductScore(a)
            );


        const keep =
            sorted[0];


        const duplicates =
            sorted.slice(1);


        console.log(
            `\n📦 ${name}`
        );


        console.log(
            `   ✅ KEEP: ${keep._id}`
        );


        for (
            const duplicate
            of duplicates
        ) {

            const cartRefs =
                await getCartReferences(
                    duplicate._id
                );


            const orderRefs =
                await getOrderReferences(
                    duplicate._id
                );


            console.log(
                `\n   Duplicate: ${duplicate._id}`
            );


            console.log(
                `   🛒 Cart References: ${cartRefs.length}`
            );


            console.log(
                `   📦 Order References: ${orderRefs.length}`
            );


            // ==================================================
            // ORDER REFERENCE
            // ==================================================

            if (
                orderRefs.length > 0
            ) {

                console.log(
                    "   🔒 PROTECTED — Used in Order History"
                );

                protectedProducts++;

                continue;

            }


            // ==================================================
            // CART REFERENCE
            // ==================================================

            if (
                cartRefs.length > 0
            ) {

                console.log(
                    "   🔄 Cart reference will move to KEEP product"
                );


                if (!DRY_RUN) {

                    await Cart.updateMany(
                        {
                            product:
                                duplicate._id
                        },
                        {
                            $set: {
                                product:
                                    keep._id
                            }
                        }
                    );

                }


                cartMoved +=
                    cartRefs.length;

            }


            // ==================================================
            // DELETE
            // ==================================================

            if (DRY_RUN) {

                console.log(
                    "   ⚠️ DRY RUN → would DELETE"
                );

            } else {

                await Product.findByIdAndDelete(
                    duplicate._id
                );

                console.log(
                    "   🗑️ Deleted safely"
                );

                deleted++;

            }

        }

    }


    console.log(
        "\n=============================="
    );

    console.log(
        "DUPLICATE CLEANUP SUMMARY"
    );

    console.log(
        "=============================="
    );


    console.log(
        `🗑️ Deleted: ${deleted}`
    );


    console.log(
        `🔒 Protected by Orders: ${protectedProducts}`
    );


    console.log(
        `🔄 Cart references moved: ${cartMoved}`
    );

};


// ======================================================
// IMAGE FIX
// ======================================================

const fixMissingImages = async () => {

    const products =
        await Product.find();


    console.log(
        "\n=============================="
    );

    console.log(
        "🖼️ IMAGE CHECK"
    );

    console.log(
        "==============================\n"
    );


    let uploaded = 0;
    let skipped = 0;
    let failed = 0;


    for (
        const product
        of products
    ) {

        console.log(
            `\n➡️ ${product.name}`
        );


        // Existing Cloudinary image
        if (
            isCloudinaryImage(
                product.image
            )
        ) {

            console.log(
                "   ✅ Image already exists"
            );

            skipped++;

            continue;

        }


        // Existing local image
        if (
            localImageExists(
                product.image
            )
        ) {

            console.log(
                "   ✅ Local image exists"
            );

            skipped++;

            continue;

        }


        try {

            const imageUrl =
                await getPexelsImage(
                    product
                );


            if (!imageUrl) {

                console.log(
                    "   ⚠️ No image found"
                );

                failed++;

                continue;

            }


            console.log(
                "   ⬇️ Downloading..."
            );


            const buffer =
                await downloadImage(
                    imageUrl
                );


            console.log(
                "   ☁️ Uploading to Cloudinary..."
            );


            const uploadedImage =
                await uploadToCloudinary(
                    buffer
                );


            if (!DRY_RUN) {

                product.image =
                    uploadedImage.secure_url;

                await product.save();

                console.log(
                    "   ✅ Image saved to MongoDB"
                );

            } else {

                console.log(
                    "   ⚠️ DRY RUN → image would be saved"
                );

            }


            uploaded++;

        } catch (error) {

            console.error(
                `   ❌ ${error.message}`
            );

            failed++;

        }

    }


    console.log(
        "\n=============================="
    );

    console.log(
        "IMAGE SUMMARY"
    );

    console.log(
        "=============================="
    );


    console.log(
        `☁️ Uploaded: ${uploaded}`
    );


    console.log(
        `⏭️ Skipped: ${skipped}`
    );


    console.log(
        `❌ Failed: ${failed}`
    );

};


// ======================================================
// MAIN
// ======================================================

const main = async () => {

    try {

        await connectDB();


        console.log(
            "\n🚀 MediCare Cleanup Started"
        );


        const products =
            await Product.find();


        console.log(
            `📦 Total Products: ${products.length}`
        );


        const duplicateGroups =
            findDuplicates(
                products
            );


        console.log(
            `🔁 Duplicate Groups: ${duplicateGroups.length}`
        );


        // Safe duplicate analysis
        await cleanupDuplicates(
            duplicateGroups
        );


        // Only check images after duplicate cleanup
        // when actually executing.
        if (!DRY_RUN) {

            await fixMissingImages();

        } else {

            console.log(
                "\n⚠️ DRY_RUN = true"
            );

            console.log(
                "Image updates are also disabled."
            );

        }


        if (DRY_RUN) {

            console.log(
                "\n================================"
            );

            console.log(
                "⚠️ DRY RUN COMPLETED"
            );

            console.log(
                "================================"
            );

            console.log(
                "No database changes were made."
            );

            console.log(
                "\nReview the results above."
            );

        } else {

            const finalProducts =
                await Product.countDocuments();

            console.log(
                "\n================================"
            );

            console.log(
                "🎉 CLEANUP COMPLETED"
            );

            console.log(
                "================================"
            );

            console.log(
                `📦 Final Products: ${finalProducts}`
            );

        }


        await mongoose.connection.close();


    } catch (error) {

        console.error(
            "\n❌ ERROR:",
            error.message
        );


        await mongoose.connection.close();

        process.exit(1);

    }

};


main();