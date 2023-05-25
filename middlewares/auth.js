import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
      return res.send({ status: "error", message: "Token not provided" });

    // if token is provided, then verify it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) return res.send({ status: "error", message: "User not found" });

    req.user = decoded;
    next();
  } catch (error) {
    res.send({ status: "error", message: error.message });
  }
};

export default auth;
