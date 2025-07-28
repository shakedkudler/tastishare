import express from "express";
import multer from "multer";
import path from "path";
import {
  createRecipe,
  getAllRecipes,     // חדש - כל המתכונים לציבור
  getUserRecipes,    // רק של המשתמש המחובר
  getRecipeById,     // שליפת מתכון בודד לפי id
    getPopularRecipes,   // הוספת הפונקציה פה
  getNewRecipes        // הוספת הפונקציה פה
} from "../controllers/recipes.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// 📁 הגדרות שמירת תמונה עם multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // לוודא שהתיקייה קיימת
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

/**
 * ✅ כל אחד יכול:
 * - לראות את כל המתכונים
 * - לראות מתכון מסוים
 */

router.get("/popular", getPopularRecipes);
router.get("/new", getNewRecipes);
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);


// 🔐 רק משתמש מחובר רואה את המתכונים שלו
router.get("/me", verifyToken, getUserRecipes);

// 🔐 יצירת מתכון – רק למשתמש מחובר
router.post("/", verifyToken, upload.single("image"), createRecipe);

export default router;
