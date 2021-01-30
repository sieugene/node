const { Router } = require("express");
const Order = require("../models/order");
const router = Router();
const auth = require("./../middleware/auth");

const checkoutOfNullCourse = (courses) => courses.filter((c) => !!c.courseId);

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      "user.userId": req.user._id,
    }).populate("user.userId");
    res.render("orders", {
      isOrder: true,
      title: "Заказы",
      orders: orders.map((o) => {
        return {
          ...o._doc,
          price: o.courses.reduce((total, c) => {
            return (total += c.count * c.course.price);
          }, 0),
        };
      }),
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.courseId").execPopulate();
    const courses = checkoutOfNullCourse(user.cart.items).map((i) => ({
      count: i.count,
      course: { ...i.courseId._doc },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses,
    });
    await order.save();
    await req.user.clearCart();

    res.redirect("/orders");
  } catch (error) {
    console.log("Error in order create", error);
  }
});

module.exports = router;
