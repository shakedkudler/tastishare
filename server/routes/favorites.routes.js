import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { db } from "../index.js";

const router = express.Router();

// שליפת כל המועדפים של המשתמש
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [favorites] = await db.query
    ("SELECT * FROM favorites WHERE user_id = ?", [userId]);
    
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בשליפת מועדפים", error: err.message });
  }
});

// הוספת מתכון למועדפים
router.post("/", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { recipe_id } = req.body;

  if (!recipe_id) return res.status(400).json({ message: "recipe_id נדרש" });

  try {
    await db.query("INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)", [userId, recipe_id]);
    res.json({ message: "המתכון נוסף למועדפים" });
  } catch (err) {
    res.status(500).json({ message: "שגיאה בשמירת מועדף", error: err.message });
  }
});

// הסרת מתכון ממועדפים
router.delete("/", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { recipe_id } = req.body;

  if (!recipe_id) return res.status(400).json({ message: "recipe_id נדרש" });

  try {
    await db.query("DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?", [userId, recipe_id]);
    res.json({ message: "המתכון הוסר מהמועדפים" });
  } catch (err) {
    res.status(500).json({ message: "שגיאה בהסרת מועדף", error: err.message });
  }
});

export default router;
