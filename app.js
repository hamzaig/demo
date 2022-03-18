require("./config/dotenv");
const db = require("./config/db");
const express = require("express");
const app = express();
const asyncHandler = require("express-async-handler");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const businessRoutes = require("./routes/businessRoutes");
db();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/business", businessRoutes);


app.get("/", (req, res, next) => {
  res.send("API is running");
})

app.use(notFound);
app.use(errorHandler);
app.listen(process.env.PORT, console.log(`server is up on port: ${process.env.PORT}`))

