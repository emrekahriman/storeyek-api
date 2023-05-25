import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import authRouter from "./routers/auth.js";
import shopRouter from "./routers/shop.js";
import userRouter from "./routers/user.js";
import pageRouter from "./routers/page.js";
import authenticate from "./middlewares/auth.js";
const app = express();
const port = process.env.PORT || 5000;
import cors from "cors";

app.use(cors());
// Serve static files from the "uploads" directory
app.use("/uploads", express.static("uploads"));

app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", authenticate, userRouter);
app.use("/page", pageRouter);
app.use(shopRouter);


app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.listen(port, async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URL);
  console.log(`Example app listening at http://localhost:${port}`);
});
