const { Router } = require("express");
const router = Router();

// Get tasks
router.get("/", (req, res) => {
  res.json({ a: 1 });
});

// Create new task
router.post("/", (req, res) => {});

// Update task
router.put("/:id", (req, res) => {});

// Delete task
router.delete("/:id", (req, red) => {});

module.exports = router;
