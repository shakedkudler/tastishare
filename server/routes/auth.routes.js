import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { createRecipe } from "../controllers/recipes.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js"; // ✅ שם מתוקן
import multer from "multer";

const router = express.Router();

// אחסון קבצים עם multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// נתיבי התחברות ורישום
router.post("/register", register);
router.post("/login", login);

// נתיב יצירת מתכון עם תמונה (דורש התחברות)
router.post("/recipes", verifyToken, upload.single("image"), createRecipe); // ✅ שם מתוקן

export default router;
