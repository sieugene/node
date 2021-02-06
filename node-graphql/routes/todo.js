const { Router } = require("express");
const Todo = require("../models/todo");
const router = Router();

// Get tasks
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.status(200).json({ todos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new task
router.post("/", async (req, res) => {
  try {
    console.log(req.body, "-----------");
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
router.put("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(+req.params.id);
    todo.done = req.body.done;
    await todo.save();
    res.status(200).json({ todo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: {
        id: +req.params.id,
      },
    });
    await todos[0].destroy();
    res.status(204).json({});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
