const express = require("express");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", protect, (req, res) => {
    res.status(200).json({
        message: "Authentication successful",
        user: req.user
    });
});
router.get(
    "/admin-test",
    protect,
    authorizeRoles("admin"),
    (req, res) => {
        res.json({
            message: "Admin access granted"
        });
    }
);
router.get(
    "/coordinator-test",
    protect,
    authorizeRoles("admin", "coordinator"),
    (req, res) => {
        res.json({
            message: "Coordinator access granted"
        });
    }
);
module.exports = router;