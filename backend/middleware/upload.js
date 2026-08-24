const multer = require("multer");


// ==========================
// Store File In Memory
// ==========================

const storage = multer.memoryStorage();


// ==========================
// File Filter
// ==========================

const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {

        cb(null, true);

    } else {

        cb(
            new Error("Only image files are allowed"),
            false
        );

    }

};


// ==========================
// Upload Configuration
// ==========================

const upload = multer({

    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter

});


module.exports = upload;