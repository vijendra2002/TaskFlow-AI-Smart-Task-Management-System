const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// ================== CREATE TASK ==================
router.post("/create", async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    // 🔥 TASK CREATE (yahin se data MongoDB Compass me jata hai)
    const task = await Task.create({
      title,
      description,
      userId
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== GET ALL TASKS ==================
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;