const { body } = require("express-validator");
const User = require("./../models/user");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Введите корректный email")
    .custom(async (value, { req }) => {
      try {
        const candidate = await User.findOne({ email: value });
        if (candidate) {
          return Promise.reject("Такой email уже занят");
        }
      } catch (error) {
        console.log(error);
      }
    }),
  body("password", "Пароль должен быть минимум 6 символовов")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric(),
  body("confirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Пароли должны совпадать");
    } else {
      return true;
    }
  }),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Имя должно быть минимум 3 символа"),
];
