const express = require("express");
const {
  getTasks,
  createTask,
} = require("../controllers/taskController");

const router = express.Router();

// GET
router.get("/", getTasks);

// POST ✅ (ADD THIS)
router.post("/", createTask);

module.exports = router;