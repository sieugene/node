const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

router.post("/add", async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect("/cart");
});

router.get("/", async (req, res) => {
  res.render("cart", {
    title: "Корзина",
    courses: req.user.cart.items,
    price: 100,
    isCart: true,
  });
});

router.delete("/remove/:id", async (req, res) => {
  const cart = await Cart.remove(req.params.id);
  res.status(200).json(cart);
});

module.exports = router;
