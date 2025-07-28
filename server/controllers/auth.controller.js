import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../index.js";
import dotenv from "dotenv";
dotenv.config();

const availableAvatars = [
  "Avatar1.png",
  "Avatar2.png",
  "Avatar3.png",
  "Avatar4.png",
  "Avatar5.png",
  "Avatar6.png",
  "Avatar7.png",
  "Avatar8.png",
  "Avatar9.png",
  "Avatar10.png"
];

export const register = async (req, res) => {
  console.log("Sign up request received");

  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      message: "Username must contain only letters and numbers (no spaces or symbols)",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

  try {
    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const randomAvatar = availableAvatars[Math.floor(Math.random() * availableAvatars.length)];

    await db.query(
      "INSERT INTO users (email, password, username, avatar) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, username, randomAvatar]
    );

    res.status(201).json({ message: "You have successfully registered" });
  } catch (err) {
    console.error("REGISTER error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  console.log("Log in request received");
  const { email, password } = req.body;

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (results.length === 0) {
      return res.status(401).json({ message: "Wrong email or password" });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    if (!user.active) {  // או user.blocked === 1 לפי שמך בעמודת החסימה
  return res.status(403).json({ message: "Your account is blocked. Please contact the administrator." });
}

    const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role }, // הוספתי role
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
///שינוי אדמין לבדיקה

   res.json({
  token,
  user: {
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.username,
    avatar: user.avatar,  // הוספה של השדה avatar
    role: user.role,  //שינוי אדמין לבדיקה
  }
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
