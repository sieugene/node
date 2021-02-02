const { Router } = require("express");
const Course = require("./../models/course");
const router = Router();
const auth = require("./../middleware/auth");
const { courseValidators } = require("../utils/validators");
const { validationResult } = require("express-validator");

function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString();
}

router.get("/", async (req, res) => {
  //достаем данные референции через populate
  const courses = await Course.find().populate("userId", "email name");
  res.render("courses", {
    title: "Курсы",
    isCourses: true,
    courses: courses.map((c) => {
      const course = c;
      course.canEdit =
        req.user &&
        c._doc.userId &&
        c._doc.userId._id.toString() === req.user._id.toString();
      return course;
    }),
  });
});

router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }
  const course = await Course.findById(req.params.id);
  if (!isOwner(course, req)) {
    return res.redirect("/courses");
  }
  res.render("course-edit", {
    title: `Редактировать ${course.title}`,
    course,
  });
});

router.post("/edit", auth, courseValidators, async (req, res) => {
  const errors = validationResult(req);
  const { id } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
  }

  delete req.body.id;
  try {
    await Course.findByIdAndUpdate(id, req.body);
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

router.post("/remove", auth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id,
    });
    res.redirect("/courses");
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render("course", {
    layout: "empty",
    title: `Курс ${course.title}`,
    course,
  });
});

module.exports = router;
