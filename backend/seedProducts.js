const mongoose = require("mongoose");
const Product = require("./models/Product");

require("dotenv").config();


// ==========================
// PRODUCT DATA
// ==========================

const products = [

    // ==========================
    // TABLETS
    // ==========================

    {
        name: "Paracetamol 500",
        description: "Pain and fever relief tablets",
        category: "Tablet",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 45,
        stock: 100,
        image: "paracetamol.png",
        expiryDate: "2028-12-31",
        prescriptionRequired: false
    },

    {
        name: "Ibuprofen 400",
        description: "Pain and inflammation relief tablets",
        category: "Tablet",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 65,
        stock: 80,
        image: "ibuprofen.png",
        expiryDate: "2028-11-30",
        prescriptionRequired: false
    },

    {
        name: "Cetirizine 10mg",
        description: "Allergy relief tablets",
        category: "Tablet",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 55,
        stock: 120,
        image: "cetirizine.png",
        expiryDate: "2029-01-31",
        prescriptionRequired: false
    },

    {
        name: "Azithromycin 500",
        description: "Antibiotic medicine",
        category: "Tablet",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 120,
        stock: 70,
        image: "azithromycin.png",
        expiryDate: "2028-10-31",
        prescriptionRequired: true
    },

    {
        name: "Pantoprazole 40mg",
        description: "Medicine for acidity and gastric discomfort",
        category: "Tablet",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 85,
        stock: 100,
        image: "pantoprazole.png",
        expiryDate: "2029-03-31",
        prescriptionRequired: false
    },

    {
        name: "Vitamin C",
        description: "Vitamin C tablets for daily nutrition",
        category: "Tablet",
        brand: "MediCare",
        manufacturer: "MediCare Nutrition",
        price: 299,
        stock: 150,
        image: "vitamin-c.png",
        expiryDate: "2029-12-31",
        prescriptionRequired: false
    },

    {
        name: "Calcium Tablets",
        description: "Calcium supplement for bone health",
        category: "Tablet",
        brand: "MediCare",
        manufacturer: "MediCare Nutrition",
        price: 249,
        stock: 90,
        image: "calcium.png",
        expiryDate: "2029-08-31",
        prescriptionRequired: false
    },

    {
        name: "Multivitamin Tablets",
        description: "Daily multivitamin nutritional supplement",
        category: "Tablet",
        brand: "MediCare",
        manufacturer: "MediCare Nutrition",
        price: 349,
        stock: 100,
        image: "multivitamin.png",
        expiryDate: "2029-09-30",
        prescriptionRequired: false
    },

    {
        name: "Antacid Tablets",
        description: "Fast relief from acidity and indigestion",
        category: "Tablet",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 60,
        stock: 100,
        image: "antacid.png",
        expiryDate: "2029-02-28",
        prescriptionRequired: false
    },

    {
        name: "Digestive Enzyme Tablets",
        description: "Supports digestion and helps with indigestion",
        category: "Tablet",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 110,
        stock: 85,
        image: "digestive.png",
        expiryDate: "2029-06-30",
        prescriptionRequired: false
    },


    // ==========================
    // CAPSULES
    // ==========================

    {
        name: "Amoxicillin 500",
        description: "Antibiotic capsule",
        category: "Capsule",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 199,
        stock: 120,
        image: "amoxicillin.png",
        expiryDate: "2028-12-31",
        prescriptionRequired: true
    },

    {
        name: "Omeprazole 20mg",
        description: "Medicine for acidity and heartburn",
        category: "Capsule",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 75,
        stock: 90,
        image: "omeprazole.png",
        expiryDate: "2029-04-30",
        prescriptionRequired: false
    },

    {
        name: "Vitamin D3 Capsules",
        description: "Vitamin D3 nutritional supplement",
        category: "Capsule",
        brand: "MediCare",
        manufacturer: "MediCare Nutrition",
        price: 199,
        stock: 100,
        image: "vitamin-d3.png",
        expiryDate: "2029-10-31",
        prescriptionRequired: false
    },

    {
        name: "Iron Supplement Capsules",
        description: "Iron and nutritional supplement capsules",
        category: "Capsule",
        brand: "MediCare",
        manufacturer: "MediCare Nutrition",
        price: 229,
        stock: 80,
        image: "iron-capsules.png",
        expiryDate: "2029-07-31",
        prescriptionRequired: false
    },


    // ==========================
    // SYRUPS
    // ==========================

    {
        name: "Cough Syrup",
        description: "Relief from cough and cold",
        category: "Syrup",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 129,
        stock: 80,
        image: "cough-syrup.png",
        expiryDate: "2028-12-31",
        prescriptionRequired: false
    },

    {
        name: "Antacid Syrup",
        description: "Liquid medicine for acidity and indigestion",
        category: "Syrup",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 119,
        stock: 90,
        image: "antacid-syrup.png",
        expiryDate: "2029-03-31",
        prescriptionRequired: false
    },

    {
        name: "Vitamin Syrup",
        description: "Multivitamin nutritional syrup",
        category: "Syrup",
        brand: "MediCare",
        manufacturer: "MediCare Nutrition",
        price: 179,
        stock: 100,
        image: "vitamin-syrup.png",
        expiryDate: "2029-05-31",
        prescriptionRequired: false
    },


    // ==========================
    // CREAMS
    // ==========================

    {
        name: "Moisturizing Cream",
        description: "Moisturizing cream for dry skin",
        category: "Cream",
        brand: "MediCare",
        manufacturer: "MediCare Healthcare",
        price: 199,
        stock: 100,
        image: "moisturizer.png",
        expiryDate: "2029-05-31",
        prescriptionRequired: false
    },

    {
        name: "Antiseptic Cream",
        description: "Cream for minor cuts and skin protection",
        category: "Cream",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 99,
        stock: 100,
        image: "antiseptic-cream.png",
        expiryDate: "2029-06-30",
        prescriptionRequired: false
    },

    {
        name: "Pain Relief Cream",
        description: "Topical cream for temporary muscle and joint discomfort",
        category: "Cream",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 149,
        stock: 75,
        image: "pain-relief-cream.png",
        expiryDate: "2029-02-28",
        prescriptionRequired: false
    },


    // ==========================
    // DROPS
    // ==========================

    {
        name: "Lubricating Eye Drops",
        description: "Eye drops for temporary relief from dry eyes",
        category: "Drops",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 149,
        stock: 70,
        image: "eye-drops.png",
        expiryDate: "2028-09-30",
        prescriptionRequired: false
    },

    {
        name: "Vitamin D Drops",
        description: "Vitamin D nutritional drops",
        category: "Drops",
        brand: "MediCare",
        manufacturer: "MediCare Nutrition",
        price: 159,
        stock: 80,
        image: "vitamin-d-drops.png",
        expiryDate: "2029-04-30",
        prescriptionRequired: false
    },

    {
        name: "Pediatric Oral Drops",
        description: "Pediatric nutritional drops",
        category: "Drops",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 129,
        stock: 75,
        image: "pediatric-drops.png",
        expiryDate: "2029-01-31",
        prescriptionRequired: false
    },


    // ==========================
    // MEDICAL DEVICES
    // ==========================

    {
        name: "Glucometer",
        description: "Digital blood sugar monitoring device",
        category: "Medical Device",
        brand: "MediCare",
        manufacturer: "MediCare Devices",
        price: 999,
        stock: 50,
        image: "glucometer.png",
        expiryDate: "2032-12-31",
        prescriptionRequired: false
    },

    {
        name: "Digital Thermometer",
        description: "Fast and accurate temperature measurement",
        category: "Medical Device",
        brand: "MediCare",
        manufacturer: "MediCare Devices",
        price: 399,
        stock: 60,
        image: "thermometer.png",
        expiryDate: "2035-12-31",
        prescriptionRequired: false
    },

    {
        name: "Blood Pressure Monitor",
        description: "Digital blood pressure monitoring device",
        category: "Medical Device",
        brand: "MediCare",
        manufacturer: "MediCare Devices",
        price: 1499,
        stock: 40,
        image: "bp-monitor.png",
        expiryDate: "2033-12-31",
        prescriptionRequired: false
    },

    {
        name: "Pulse Oximeter",
        description: "Finger pulse oximeter for oxygen measurement",
        category: "Medical Device",
        brand: "MediCare",
        manufacturer: "MediCare Devices",
        price: 699,
        stock: 75,
        image: "pulse-oximeter.png",
        expiryDate: "2033-12-31",
        prescriptionRequired: false
    },

    {
        name: "Digital Weighing Scale",
        description: "Digital body weight measurement scale",
        category: "Medical Device",
        brand: "MediCare",
        manufacturer: "MediCare Devices",
        price: 899,
        stock: 45,
        image: "weighing-scale.png",
        expiryDate: "2034-12-31",
        prescriptionRequired: false
    },

    {
        name: "Nebulizer",
        description: "Portable nebulizer for respiratory therapy",
        category: "Medical Device",
        brand: "MediCare",
        manufacturer: "MediCare Devices",
        price: 1899,
        stock: 30,
        image: "nebulizer.png",
        expiryDate: "2034-12-31",
        prescriptionRequired: false
    },

    {
        name: "Heating Pad",
        description: "Electric heating pad for muscle comfort",
        category: "Medical Device",
        brand: "MediCare",
        manufacturer: "MediCare Devices",
        price: 799,
        stock: 55,
        image: "heating-pad.png",
        expiryDate: "2033-12-31",
        prescriptionRequired: false
    },


    // ==========================
    // INJECTIONS
    // ==========================

    {
        name: "Vitamin B12 Injection",
        description: "Vitamin B12 injection for clinical use",
        category: "Injection",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 180,
        stock: 40,
        image: "vitamin-b12-injection.png",
        expiryDate: "2028-10-31",
        prescriptionRequired: true
    },

    {
        name: "Vitamin D Injection",
        description: "Vitamin D injection for clinical use",
        category: "Injection",
        brand: "MediCare",
        manufacturer: "MediCare Pharma",
        price: 220,
        stock: 35,
        image: "vitamin-d-injection.png",
        expiryDate: "2028-11-30",
        prescriptionRequired: true
    }

];


// ==========================
// CONNECT DATABASE
// ==========================

const seedProducts = async () => {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB Connected"
        );


        // ==========================
        // INSERT PRODUCTS
        // ==========================

        await Product.insertMany(
            products
        );


        console.log(
            `${products.length} products added successfully`
        );


        process.exit(0);

    } catch (error) {

        console.error(
            "Seed Error:",
            error.message
        );

        process.exit(1);

    }

};


seedProducts();