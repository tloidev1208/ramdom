const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const swaggerDocs = require("./swagger");

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------
// Swagger UI
swaggerDocs(app);

// -----------------------------
// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ Error:", err));

// -----------------------------
// Player Schema
const Player = mongoose.model("Player", {
  name: { type: String, required: true },
  skinScore: { type: Number, default: 0 },
  skillScore: { type: Number, default: 0 },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Player:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Tên người chơi
 *         skinScore:
 *           type: integer
 *           description: Điểm skin
 *         skillScore:
 *           type: integer
 *           description: Điểm skill
 */

/**
 * @swagger
 * /player:
 *   post:
 *     summary: Thêm người chơi mới
 *     tags: [Player]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Player'
 *     responses:
 *       200:
 *         description: Người chơi đã được lưu
 */

/**
 * @swagger
 * /ranking/skin:
 *   get:
 *     summary: Lấy bảng xếp hạng theo skin
 *     tags: [Ranking]
 *     responses:
 *       200:
 *         description: Danh sách người chơi theo skinScore giảm dần
 *
 * /ranking/skill:
 *   get:
 *     summary: Lấy bảng xếp hạng theo skill
 *     tags: [Ranking]
 *     responses:
 *       200:
 *         description: Danh sách người chơi theo skillScore giảm dần
 */

// -----------------------------
// API: Thêm người chơi
app.post("/player", async (req, res) => {
  try {
    const { name, skinScore, skillScore } = req.body;

    if (!name)
      return res.status(400).json({ error: "Tên người chơi là bắt buộc." });

    const newPlayer = await Player.create({
      name,
      skinScore: skinScore || 0,
      skillScore: skillScore || 0,
    });

    res.json({
      message: "Đã lưu người chơi!",
      player: newPlayer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// API: Ranking skin
app.get("/ranking/skin", async (req, res) => {
  const ranking = await Player.find().sort({ skinScore: -1 });
  res.json(ranking);
});

// -----------------------------
// API: Ranking skill
app.get("/ranking/skill", async (req, res) => {
  const ranking = await Player.find().sort({ skillScore: -1 });
  res.json(ranking);
});

// -----------------------------
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server chạy tại http://localhost:${process.env.PORT}`),
console.log(`🚀 Swagger chạy tại http://localhost:8080/api-docs`)
);
