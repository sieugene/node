const { Router } = require("express");
const bcrypt = require("bcryptjs");
const User = require("./../models/user");
const reqEmail = require("../emails/registration");
const keys = require("../keys");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const router = Router();
const sgMail = require("@sendgrid/mail");
const resetEmail = require("../emails/reset");
const { registerValidators } = require("../utils/validators");
sgMail.setApiKey(keys.SENDGRID_API_KEY);

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Авторизация",
    isLogin: true,
    loginError: req.flash("loginError"),
    registerError: req.flash("registerError"),
  });
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);
      if (areSame) {
        req.session.user = candidate;
        req.session.isAuth = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect("/");
        });
      } else {
        req.flash("loginError", "Пароль неверный!");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("loginError", "Такого пользователя не существует!");
      res.redirect("/auth/login#login");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", registerValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("registerError", errors.array()[0].msg);
      return res.status(422).redirect("/auth/login#register");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      name,
      password: hashPassword,
      cart: {
        items: [],
      },
    });
    await user.save();
    try {
      await sgMail.send(reqEmail(email));
      res.redirect("/auth/login#login");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.get("/reset", async (req, res) => {
  res.render("auth/reset", {
    title: "Забыли пароль?",
    error: req.flash("error"),
  });
});

router.post("/reset", (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash("error", "Что-то пошло не так, повторите попытку позже");
        return res.redirect("/auth/reset");
      }
      const token = buffer.toString("hex");
      const candidate = await User.findOne({ email: req.body.email });
      if (candidate) {
        candidate.resetToken = token;
        //1 hour
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();
        await sgMail.send(resetEmail(candidate.email, token));
        res.redirect("/auth/login");
      } else {
        req.flash("error", "Такого email нет");
        res.redirect("/auth/reset");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/password/:token", async (req, res) => {
  if (!req.params.token) {
    return res.redirect("/auth/login");
  }
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    });
    if (!user) {
      return res.redirect("/auth/login");
    } else {
      res.render("auth/password", {
        title: "Восстановить доступ",
        error: req.flash("error"),
        userId: user._id.toString(),
        token: req.params.token,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/password", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() },
    });
    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect("/auth/login");
    } else {
      req.flash("loginError", "Время жизни токена истекло");
      res.redirect("/auth/login");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
