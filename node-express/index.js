const express = require("express");
const exphbs = require("express-handlebars");
//for access proto
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
//end
const mongoose = require("mongoose");
const homeRoutes = require("./routes/home");
const addCourseRoutes = require("./routes/add");
const courseRoutes = require("./routes/courses");
const cartRoutes = require("./routes/cart");
const path = require("path");

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
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

async function start() {
  try {
    const url =
      "mongodb+srv://sieugene:WanVnm6YFFsq3bL8@cluster0.bgdkp.mongodb.net/shop";
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
