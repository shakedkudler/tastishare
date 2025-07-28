import express from "express";
import { db } from "../db.js";

const router = express.Router();

// שליפת כל הקטגוריות
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    res.json(rows);
  } catch (err) {
    console.error("Error loading categories:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
