import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import recipeRoutes from "./routes/recipes.routes.js"; // 
import { verifyToken } from "./middleware/auth.middleware.js";
import multer from "multer";
import path from "path";
import favoriteRoutes from "./routes/favorites.routes.js"; 
import categoryRoutes from "./routes/categories.routes.js";
import { db } from "./db.js";

const app = express();
const port = 3001;



app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/favorites", favoriteRoutes);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// export const db = await mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'mypassword',
//   database: "recipes"
// });

// console.log("Connected to MySQL");
// server/index.js
app.get("/api/recipes", async (req, res) => {
  try {
    // שליפת כל המתכונים
    const [recipes] = await db.query("SELECT * FROM recipes WHERE active = 1");

    // אין מתכונים? מחזירים ריק
    if (!recipes.length) return res.json([]);

    // שליפת כל הקטגוריות של כל המתכונים
    const recipeIds = recipes.map(r => r.id);
    if (!recipeIds.length) return res.json([]); // ליתר בטחון

    // יצירת placeholders בטוח ב-SQL
    const placeholders = recipeIds.map(() => "?").join(",");
    const [cats] = await db.query(
      `SELECT rc.recipe_id, c.id, c.name
       FROM recipe_categories rc
       JOIN categories c ON rc.category_id = c.id
       WHERE rc.recipe_id IN (${placeholders})`,
      recipeIds
    );

    // קיבוץ קטגוריות לפי מתכון
    const categoriesMap = {};
    cats.forEach(cat => {
      if (!categoriesMap[cat.recipe_id]) categoriesMap[cat.recipe_id] = [];
      categoriesMap[cat.recipe_id].push({ id: cat.id, name: cat.name });
    });

    // הוספת קטגוריות לכל מתכון
    const recipesWithCategories = recipes.map(recipe => ({
      ...recipe,
      categories: categoriesMap[recipe.id] || []
    }));

    res.json(recipesWithCategories);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: err.message });
  }
});
// שליפת כל המתכונים (כולל חסומים) – ל-Admin בלבד
app.get("/api/admin/recipes", verifyToken, async (req, res) => {
 if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied: Admins only." });
  }
  // ⭐️ הוסיפי את זה!
  

  try {
    // שליפת כל המתכונים, בלי סינון
    const [recipes] = await db.query("SELECT * FROM recipes");

    if (!recipes.length) return res.json([]);

    // שאר הקוד כמו בנתיב הקיים (קטגוריות וכו’)
    const recipeIds = recipes.map(r => r.id);
    if (!recipeIds.length) return res.json([]);

    const placeholders = recipeIds.map(() => "?").join(",");
    const [cats] = await db.query(
      `SELECT rc.recipe_id, c.id, c.name
       FROM recipe_categories rc
       JOIN categories c ON rc.category_id = c.id
       WHERE rc.recipe_id IN (${placeholders})`,
      recipeIds
    );

    const categoriesMap = {};
    cats.forEach(cat => {
      if (!categoriesMap[cat.recipe_id]) categoriesMap[cat.recipe_id] = [];
      categoriesMap[cat.recipe_id].push({ id: cat.id, name: cat.name });
    });

    const recipesWithCategories = recipes.map(recipe => ({
      ...recipe,
      categories: categoriesMap[recipe.id] || []
    }));

    res.json(recipesWithCategories);
  } catch (err) {
    console.error("Error fetching all recipes (admin):", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/admin/users/:id/deactivate", verifyToken, async (req, res) => {
  const { id } = req.params;

  // רק אדמין יכול למחוק משתמשים
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    // עדכון שדה active ל-0 (מחיקה רכה)
    await db.query("UPDATE users SET active = 0 WHERE id = ?", [id]);
    res.json({ message: "User deactivated successfully" });
  } catch (err) {
    console.error("Error deactivating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.patch("/api/users/:id/active", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;
  const userRole = req.user.role;

  // רק אדמין יכול לשנות סטטוס של משתמשים אחרים
  if (userRole !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    // עדכון סטטוס המשתמש
    await db.query("UPDATE users SET active = ? WHERE id = ?", [active, id]);
    res.json({ message: "User status updated" });
  } catch (err) {
    console.error("Error updating user active status:", err);
    res.status(500).json({ message: "Server error" });
  }
});




app.get("/api/my-recipes", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const query = "SELECT * FROM recipes WHERE userId = ? AND active = 1";

  try {
    const [results] = await db.query(query, [userId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/recipes/random/6", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM recipes WHERE active = 1 ORDER BY RAND() LIMIT 6");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// נניח שיש לך משתנה db שמאפשר לך לשלוף מתכונים מהמסד

app.get('/api/recipes/popular', async (req, res) => {
  try {
    const [recipes] = await db.query(`
      SELECT r.*, AVG(rv.rating) AS averageRating
      FROM recipes r
      LEFT JOIN reviews rv ON r.id = rv.recipe_id
      WHERE r.active = 1 AND r.image IS NOT NULL AND r.image != ''
      GROUP BY r.id
      HAVING averageRating > 4
      ORDER BY averageRating DESC
      LIMIT 6;
    `);

    res.json(recipes);
  } catch (error) {
    console.error('Failed to fetch popular recipes:', error);
    res.status(500).json({ error: 'Failed to fetch popular recipes' });
  }
});


// מסלול לקבלת מתכונים חדשים (6 אחרונים עם תמונה)
app.get('/api/recipes/new', async (req, res) => {
  try {
    // שליפת 6 מתכונים אחרונים עם תמונה
    const [newRecipes] = await db.query(
      `SELECT * FROM recipes WHERE image IS NOT NULL AND image != '' AND active = 1 ORDER BY created_at DESC LIMIT 6`
    );
    res.json(newRecipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch new recipes' });
  }
});
app.get("/api/recipes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [recipes] = await db.query(
      "SELECT * FROM recipes WHERE id = ? AND active = 1",
      [id]
    );

    if (recipes.length === 0) {
      return res.status(404).json({ message: "The recipe is not found" });
    }

    res.json(recipes[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put("/api/recipes/:id/deactivate", verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // const [recipes] = await db.query(
    //   "SELECT * FROM recipes WHERE id = ? AND userId = ?",
    //   [id, userId]
    // );

    // if (recipes.length === 0) {
    //   return res.status(403).json({ message: "You do not have permission to delete this recipe" });
    // } שינוי אדמין לבדיקה
        let recipes;
    if (req.user.role === 'admin') {
      // אדמין רואה הכל
      [recipes] = await db.query(
        "SELECT * FROM recipes WHERE id = ?",
        [id]
      );
    } else {
      // משתמש רגיל – רק מתכון שלו
      [recipes] = await db.query(
        "SELECT * FROM recipes WHERE id = ? AND userId = ?",
        [id, userId]
      );
    }

    if (recipes.length === 0) {
      return res.status(403).json({ message: "You do not have permission to delete this recipe" });
    }


    await db.query("UPDATE recipes SET active = 0 WHERE id = ?", [id]);
    res.json({ message: "The recipe was successfully deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/recipes/:id/reactivate", verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    let recipes;
    if (req.user.role === 'admin') {
      [recipes] = await db.query(
        "SELECT * FROM recipes WHERE id = ?",
        [id]
      );
    } else {
      [recipes] = await db.query(
        "SELECT * FROM recipes WHERE id = ? AND userId = ?",
        [id, userId]
      );
    }

    if (recipes.length === 0) {
      return res.status(403).json({ message: "You do not have permission to reactivate this recipe" });
    }

    await db.query("UPDATE recipes SET active = 1 WHERE id = ?", [id]);
    res.json({ message: "The recipe was successfully reactivated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// app.put("/api/recipes/:id", verifyToken, upload.single("image"), async (req, res) => {
//   const { id } = req.params;
//   const userId = req.user.id;

//   const {
//     title,
//     description,
//     ingredients,
//     steps,
//     categories,
//     prep_time,    // זמן הכנה חדש
//     cook_time,    // זמן בישול חדש
//   } = req.body;

//   try {
//     const [recipes] = await db.query(
//       "SELECT * FROM recipes WHERE id = ? AND userId = ? AND active = 1",
//       [id, userId]
//     );

//     if (recipes.length === 0) {
//       return res.status(403).json({ message: "אין לך הרשאה לערוך את המתכון הזה" });
//     }

//     // עדכון מתכון כולל השדות החדשים
//     const image = req.file ? req.file.filename : recipes[0].image;
//     await db.query(
//   `UPDATE recipes
//    SET title = ?, description = ?, image = ?, prep_time = ?, cook_time = ?
//    WHERE id = ?`,
//   [title, description, image, prep_time, cook_time, id]
// );


//     // ננקה את המצרכים/שלבים/קטגוריות הישנים
//     await db.query("DELETE FROM ingredients WHERE recipe_id = ?", [id]);
//     await db.query("DELETE FROM steps WHERE recipe_id = ?", [id]);
//     await db.query("DELETE FROM recipe_categories WHERE recipe_id = ?", [id]);

//     // הכנסת מצרכים חדשים
//     const parsedIngredients = JSON.parse(ingredients);
//     for (const ing of parsedIngredients) {
//       await db.query(
//         "INSERT INTO ingredients (recipe_id, name, quantity) VALUES (?, ?, ?)",
//         [id, ing.name, ing.quantity]
//       );
//     }

//     // הכנסת שלבים חדשים
//     const parsedSteps = JSON.parse(steps);
//     for (let i = 0; i < parsedSteps.length; i++) {
//       await db.query(
//         "INSERT INTO steps (recipe_id, step_number, description) VALUES (?, ?, ?)",
//         [id, i + 1, parsedSteps[i].description]
//       );
//     }

//     // הכנסת קטגוריות חדשות
//     const selectedCats = Array.isArray(categories) ? categories : [categories];
//     for (const catId of selectedCats) {
//       await db.query(
//         "INSERT INTO recipe_categories (recipe_id, category_id) VALUES (?, ?)",
//         [id, catId]
//       );
//     }

//     res.json({ message: "המתכון עודכן בהצלחה" });
//   } catch (err) {
//     console.error("❌ שגיאה בעדכון מתכון:", err);
//     res.status(500).json({ message: "שגיאת שרת" });
//   }
// });  שינוי אדמין לבדיקה
app.put("/api/recipes/:id", verifyToken, upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const {
    title,
    description,
    ingredients,
    steps,
    categories,
    prep_time,    // זמן הכנה חדש
    cook_time,    // זמן בישול חדש
  } = req.body;

  try {
    // הרשאה: בעל המתכון או אדמין
    let recipes;
    if (req.user.role === 'admin') {
      [recipes] = await db.query(
        "SELECT * FROM recipes WHERE id = ?",
        [id]
      );
    } else {
      [recipes] = await db.query(
        "SELECT * FROM recipes WHERE id = ? AND userId = ? AND active = 1",
        [id, userId]
      );
    }

    if (recipes.length === 0) {
      return res.status(403).json({ message: "אין לך הרשאה לערוך את המתכון הזה" });
    }

    // עדכון מתכון כולל השדות החדשים
    const image = req.file ? req.file.filename : recipes[0].image;
    await db.query(
      `UPDATE recipes
       SET title = ?, description = ?, image = ?, prep_time = ?, cook_time = ?
       WHERE id = ?`,
      [title, description, image, prep_time, cook_time, id]
    );

    // ננקה את המצרכים/שלבים/קטגוריות הישנים
    await db.query("DELETE FROM ingredients WHERE recipe_id = ?", [id]);
    await db.query("DELETE FROM steps WHERE recipe_id = ?", [id]);
    await db.query("DELETE FROM recipe_categories WHERE recipe_id = ?", [id]);

    // הכנסת מצרכים חדשים
    const parsedIngredients = JSON.parse(ingredients);
    for (const ing of parsedIngredients) {
      await db.query(
        "INSERT INTO ingredients (recipe_id, name, quantity) VALUES (?, ?, ?)",
        [id, ing.name, ing.quantity]
      );
    }

    // הכנסת שלבים חדשים
    const parsedSteps = JSON.parse(steps);
    for (let i = 0; i < parsedSteps.length; i++) {
      await db.query(
        "INSERT INTO steps (recipe_id, step_number, description) VALUES (?, ?, ?)",
        [id, i + 1, parsedSteps[i].description]
      );
    }

    // הכנסת קטגוריות חדשות
    const selectedCats = Array.isArray(categories) ? categories : [categories];
    for (const catId of selectedCats) {
      await db.query(
        "INSERT INTO recipe_categories (recipe_id, category_id) VALUES (?, ?)",
        [id, catId]
      );
    }

    res.json({ message: "המתכון עודכן בהצלחה" });
  } catch (err) {
    console.error("❌ שגיאה בעדכון מתכון:", err);
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

app.post("/api/recipes/:id/upload-image", verifyToken, upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const image = req.file?.filename;

  if (!image) {
    return res.status(400).json({ error: "No image sent" });
  }

  try {
    const [recipes] = await db.query(
      "SELECT * FROM recipes WHERE id = ? AND userId = ?",
      [id, userId]
    );

    if (recipes.length === 0) {
      return res.status(403).json({ error: "You do not have permission to edit this recipe" });
    }

    await db.query("UPDATE recipes SET image = ? WHERE id = ?", [image, id]);

    res.json({ message: "The image was uploaded successfully", filename: image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/reviews/:id", verifyToken, async (req, res) => {
  const { id } = req.params; // ID של המתכון
  const { comment, rating } = req.body;
  const userId = req.user.id;

  if (!comment || !rating) {
    return res.status(400).json({ message: "יש לספק גם תגובה וגם דירוג" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO reviews (recipe_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())",
      [id, userId, rating, comment]
    );

    const [newReview] = await db.query(
      `SELECT r.comment, r.rating, r.created_at, u.username, u.avatar
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ review: newReview[0] });
  } catch (err) {
    console.error("❌ שגיאה בהוספת ביקורת:", err);
    res.status(500).json({ message: "שגיאה בהוספת ביקורת" });
  }
});

app.get("/api/favorites/user/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  console.log("Fetching favorites for user:", userId);

  try {
    const [rows] = await db.query(
      `SELECT r.id AS recipe_id, r.title, r.description
FROM favorites f
JOIN recipes r ON f.recipe_id = r.id
JOIN users u ON r.userId = u.id
WHERE f.user_id = ? AND r.active = 1 AND u.active = 1`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/favorites/:recipeId", verifyToken, async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user.id;

  try {
    await db.query(
      "INSERT IGNORE INTO favorites (user_id, recipe_id) VALUES (?, ?)",
      [userId, recipeId]
    );
    res.json({ message: "מתכון נוסף למועדפים" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/favorites/:recipeId", verifyToken, async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user.id;

  try {
    await db.query(
      "DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?",
      [userId, recipeId]
    );
    res.json({ message: "המתכון הוסר מהמועדפים" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/favorites/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT r.id, r.title, r.description
       FROM favorites f
       JOIN recipes r ON f.recipe_id = r.id
       WHERE f.user_id = ?`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/favorites/:recipeId", verifyToken, async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      "SELECT * FROM favorites WHERE user_id = ? AND recipe_id = ?",
      [userId, recipeId]
    );
    res.json({ isFavorite: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// חושף את תיקיית התמונות
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ שליפת כל פרטי המתכון כולל מצרכים, שלבים וביקורות
app.get("/api/recipes/:id/full", async (req, res) => {
  const { id } = req.params;

  try {
    // פרטי מתכון + שם משתמש + אווטאר כולל זמני הכנה ובישול
    const [recipes] = await db.query(
      `SELECT r.*, u.username, u.avatar,
              r.prep_time, r.cook_time, r.total_time
       FROM recipes r
       JOIN users u ON r.userId = u.id
       WHERE r.id = ? AND r.active = 1`,
      [id]
    );

    if (recipes.length === 0) {
      return res.status(404).json({ message: "המתכון לא נמצא" });
    }

    const recipe = recipes[0];

    // מצרכים
    const [ingredients] = await db.query(
      "SELECT name, quantity FROM ingredients WHERE recipe_id = ? ORDER BY id ASC",
      [id]
    );

    // שלבים
    const [steps] = await db.query(
      "SELECT step_number, description FROM steps WHERE recipe_id = ? ORDER BY step_number ASC",
      [id]
    );

    // קטגוריות
    const [categories] = await db.query(
      `SELECT c.id, c.name
       FROM recipe_categories rc
       JOIN categories c ON rc.category_id = c.id
       WHERE rc.recipe_id = ?`,
      [id]
    );

    // ביקורות - עם שם משתמש ואווטאר
    const [reviews] = await db.query(
      `SELECT r.comment, r.rating, r.created_at, u.username, u.avatar
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.recipe_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    let isFavorite = false;
    const [favRows] = await db.query(
        `SELECT 1 
         FROM favorites f
         JOIN users u ON f.user_id = u.id
         WHERE recipe_id = ? LIMIT 1`,
        [id]
      );
    isFavorite = favRows.length > 0;

    // שליחה ללקוח
    res.json({
      ...recipe,
      isFavorite,
      ingredients,
      steps,
      reviews,
      categories,
    });
  } catch (err) {
    console.error("❌ שגיאה בשליפת מתכון מלא:", err);
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

// ✅ שליפת פרטי משתמש לפי מזהה
app.get("/api/users/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT id, username, email, avatar FROM users WHERE id = ?",  // הוספתי avatar פה
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});
app.delete("/api/users/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // רק המשתמש עצמו יכול למחוק את עצמו
  if (String(userId) !== String(id)) {
    return res.status(403).json({ message: "אין לך הרשאה למחוק את המשתמש הזה" });
  }

  try {
    const [result] = await db.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "המשתמש לא נמצא" });
    }
    res.json({ message: "החשבון נמחק לצמיתות!" });
  } catch (err) {
    console.error("שגיאה במחיקת חשבון:", err);
    res.status(500).json({ message: "שגיאת שרת" });
  }
});


app.use("/api/categories", categoryRoutes);
app.get("/api/users", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, username, email, avatar, active, role FROM users"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});
///שינוי אדמין לבדיקה

app.put("/api/users/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // מזהה המשתמש המחובר
  const { username, avatar } = req.body;

  if (String(userId) !== String(id)) {
    return res.status(403).json({ message: "You are not authorized to update this user" });
  }

  // בדיקה אם יש שדות לעדכן
  if ((username === undefined || username.trim() === "") && (avatar === undefined || avatar.trim() === "")) {
    return res.status(400).json({ message: "Username or avatar must be provided" });
  }

  try {
    if (username !== undefined && username.trim() !== "") {
      // בדיקת כפילות username
      const [existingUsers] = await db.query(
        "SELECT * FROM users WHERE username = ? AND id != ?",
        [username, id]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    let fields = [];
    let values = [];

    if (username !== undefined && username.trim() !== "") {
      fields.push("username = ?");
      values.push(username);
    }
    if (avatar !== undefined && avatar.trim() !== "") {
      fields.push("avatar = ?");
      values.push(avatar);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    values.push(id);

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    await db.query(sql, values);

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



// server/index.js
export { db } from "./db.js";
