import { db } from "../index.js";
import fs from "fs";
import path from "path";

// ✅ יצירת מתכון חדש
export const createRecipe = async (req, res) => {
  try {
    const { title, description, prep_time, cook_time, total_time } = req.body;
    const userId = req.user.id; // מהטוקן
    const image = req.file ? req.file.filename : null;

    const ingredients = JSON.parse(req.body.ingredients || "[]");
    const steps = JSON.parse(req.body.steps || "[]");

    let categories = [];
    if ("categories" in req.body) {
      if (Array.isArray(req.body.categories)) {
        categories = req.body.categories;
      } else if (req.body.categories) {
        categories = [req.body.categories];
      }
    }

    if (!title || !description) {
      return res.status(400).json({ message: "יש למלא את כל השדות" });
    }

    // הוספת זמני הכנה ובישול ל-INSERT
    const [result] = await db.query(
      `INSERT INTO recipes 
       (title, description, image, userId, active, created_at, prep_time, cook_time)
       VALUES (?, ?, ?, ?, 1, NOW(), ?, ?)`,
      [title, description, image, userId, prep_time || null, cook_time || null, total_time || null]
    );

    const recipeId = result.insertId;

    for (const ing of ingredients) {
      await db.query(
        "INSERT INTO ingredients (recipe_id, name, quantity) VALUES (?, ?, ?)",
        [recipeId, ing.name, ing.quantity]
      );
    }

    for (let i = 0; i < steps.length; i++) {
      await db.query(
        "INSERT INTO steps (recipe_id, step_number, description) VALUES (?, ?, ?)",
        [recipeId, i + 1, steps[i].description]
      );
    }

    for (const catId of categories) {
      if (catId) {
        await db.query(
          "INSERT INTO recipe_categories (recipe_id, category_id) VALUES (?, ?)",
          [recipeId, Number(catId)]
        );
      }
    }

    res.status(201).json({
      message: "Recipe created successfully",
      recipeId,
    });
  } catch (err) {
    console.error("❌ Error creating recipe:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ שליפת כל המתכונים של המשתמש הנוכחי
export const getUserRecipes = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT id, title, description, image, created_at
      FROM recipes
      WHERE userId = ? AND active = 1
      ORDER BY created_at DESC
    `;

    const [recipes] = await db.query(query, [userId]);

    res.status(200).json({ recipes });
  } catch (err) {
    console.error("❌ Error fetching user recipes:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// ✅ שליפת כל המתכונים (ציבורי) עם ממוצע דירוג וקטגוריות
export const getAllRecipes = async (req, res) => {
  try {
    // שליפת כל המתכונים יחד עם ממוצע הדירוג
    const [recipes] = await db.query(`
      SELECT r.*, AVG(rv.rating) AS averageRating
      FROM recipes r
      LEFT JOIN reviews rv ON r.id = rv.recipe_id
      WHERE r.active = 1
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `);

    if (!recipes.length) return res.json([]);

    // שליפת כל הקטגוריות עבור כל המתכונים בבת אחת
    const recipeIds = recipes.map(r => r.id);
    if (!recipeIds.length) return res.json([]);

    const [cats] = await db.query(
      `SELECT rc.recipe_id, c.id, c.name
       FROM recipe_categories rc
       JOIN categories c ON rc.category_id = c.id
       WHERE rc.recipe_id IN (${recipeIds.map(() => '?').join(',')})`,
      recipeIds
    );

    // מיפוי קטגוריות לפי מזהה מתכון
    const categoriesMap = {};
    cats.forEach(cat => {
      if (!categoriesMap[cat.recipe_id]) categoriesMap[cat.recipe_id] = [];
      categoriesMap[cat.recipe_id].push({ id: cat.id, name: cat.name });
    });

    // הוספת שדה קטגוריות לכל מתכון
    const recipesWithCategories = recipes.map(recipe => ({
      ...recipe,
      categories: categoriesMap[recipe.id] || []
    }));

    res.json(recipesWithCategories);
  } catch (err) {
    console.error("❌ Error fetching all recipes:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ מתכונים פופולריים (ממוצע דירוג מעל 4, מוגבל ל-6 מתכונים)
export const getPopularRecipes = async (req, res) => {
  try {
    const [recipes] = await db.query(`
      SELECT r.*, AVG(rv.rating) AS averageRating
      FROM recipes r
      LEFT JOIN reviews rv ON r.id = rv.recipe_id
      WHERE r.active = 1
      GROUP BY r.id
      HAVING averageRating > 4
      ORDER BY averageRating DESC
      LIMIT 6
    `);
    res.json(recipes);
  } catch (err) {
    console.error("❌ Error fetching popular recipes:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ מתכונים חדשים (6 מתכונים אחרונים עם תמונה)
export const getNewRecipes = async (req, res) => {
  try {
    const [recipes] = await db.query(`
      SELECT * FROM recipes
      WHERE active = 1 AND image IS NOT NULL AND image != ''
      ORDER BY created_at DESC
      LIMIT 6
    `);
    res.json(recipes);
  } catch (err) {
    console.error("❌ Error fetching new recipes:", err);
    res.status(500).json({ message: "Server error" });
  }
};




// ✅ שליפת מתכון לפי מזהה
export const getRecipeById = async (req, res) => {
  const { id } = req.params;
  try {
    const [recipes] = await db.query("SELECT * FROM recipes WHERE id = ? AND active = 1", [id]);

    if (recipes.length === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipes[0]);
  } catch (err) {
    console.error("❌ Error fetching recipe by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};
