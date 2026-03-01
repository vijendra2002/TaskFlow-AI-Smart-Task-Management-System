const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// create task
router.post("/create", async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

// get all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

module.exports = router;