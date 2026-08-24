const Razorpay = require("razorpay");

const getRazorpay = () => {
    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!keyId || !keySecret) {
        throw new Error("Razorpay API keys are missing in .env");
    }

    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret
    });
};

module.exports = { getRazorpay };
