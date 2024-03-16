const express = require("express");
const cors = require("cors");
const config = require("./config");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");

process.on("uncaughtException", (e) => {
  console.log(e.message);
});

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors());

app.get("/", (req, res) => {
  res.send({
    message: "Hello World!",
  });
});

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

// catch 404 routes
app.use((req, res) => {
  return res.status(404).send({
    status: 404,
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
  });
});

// error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).send({
    status: err.status || 500,
    success: false,
    message: err.message || "Internal server error.",
  });
});

app.listen(config.get("port"), () => {
  console.log("Server Running...");
});
