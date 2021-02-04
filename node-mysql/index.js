const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const todoRoutes = require("./routes/todo");

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/todo", todoRoutes);

app.use((req, res, next) => {
  res.sendFile("/index.html");
});


app.listen(PORT);
