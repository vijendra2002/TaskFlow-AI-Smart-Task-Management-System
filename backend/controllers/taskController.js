const Task = require("../models/Task");

// GET all tasks
const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

// POST create task 
const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
};

module.exports = { getTasks, createTask };