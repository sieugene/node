const { Router } = require("express");
const Todo = require("../models/todo");
const router = Router();

// Get tasks
router.get("/", (req, res) => {
  res.json({ a: 1 });
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new task
router.post("/", async (req, res) => {
  try {
    console.log(req.body, '-----------');
    const todo = await Todo.create({
      title: req.body.title,
      done: false,
    });
    res.status(201).json({ todo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update task
router.put("/:id", (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete task
router.delete("/:id", (req, red) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
