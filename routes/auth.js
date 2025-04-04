const express = require("express");
const router = express.Router();
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

// Register Page
router.get("/register", (req, res) => {
    res.render("register");
});

// Signup Handler
router.get("/signup", async (req, res) => {
    const { name, email, pwd } = req.query;

    try {
        await db.collection("users").add({
            name,
            email,
            password: pwd,
        });
        res.render("login");
    } catch (error) {
        console.error("Error registering user:", error);
        res.send("Error signing up. Please try again.");
    }
});

// Login Page
router.get("/login", (req, res) => {
    res.render("login");
});

// Signin Handler
router.get("/signin", async (req, res) => {
    const { email, pwd } = req.query;

    try {
        const users = await db.collection("users")
            .where("email", "==", email)
            .where("password", "==", pwd)
            .get();

        if (users.size > 0) {
            res.render("search");
        } else {
            res.render("loginfailed");
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.send("Error logging in. Please try again.");
    }
});

module.exports = router;
