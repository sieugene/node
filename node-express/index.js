const express = require("express");
const exphbs = require("express-handlebars");
const homeRoutes = require("./routes/home");
const addCourseRoutes = require("./routes/add");
const courseRoutes = require("./routes/courses");
const cartRoutes = require("./routes/cart");
const path = require("path");

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", homeRoutes);
app.use("/add", addCourseRoutes);
app.use("/courses", courseRoutes);
app.use("/cart", cartRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
