const { Router } = require("express");
const Order = require('../models/order')
const router = Router();

router.get("/", async (req, res) => {
  res.render("orders", {
    isOrder: true,
    title: "Заказы",
  });
});

router.post("/", async (req, res) => {
  res.redirect("/orders");
  // res.render("orders", {
  //   isOrder: true,
  //   title: "Заказы",
  // });
});

module.exports = router;
