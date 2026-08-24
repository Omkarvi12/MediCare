const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    getSingleUser,
    deleteUser
} = require("../controllers/userController");

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");


// ==========================
// Get All Users
// ==========================

router.get(
    "/",
    protect,
    admin,
    getAllUsers
);


// ==========================
// Get Single User
// ==========================

router.get(
    "/:id",
    protect,
    admin,
    getSingleUser
);


// ==========================
// Delete User
// ==========================

router.delete(
    "/:id",
    protect,
    admin,
    deleteUser
);


module.exports = router;