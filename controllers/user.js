import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import Order from "../models/OrderModel.js";
import updateProfileValidation from "../validations/updateProfileValidation.js";
import updatePasswordValidation from "../validations/updatePasswordValidation.js";
import bcrypt from "bcrypt";
import sharp from "sharp";
import fs from "fs";

export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;

    // Validate user input
    const { error } = updateProfileValidation({ fullName, phone, address });
    if (error) return res.send({ status: "error", error });

    // Get user from db
    const user = await User.findById(req.user._id);
    if (!user) return res.send({ status: "error", error: "User not found" });

    // Update user information
    user.fullName = fullName;
    user.phone = phone;
    user.address = address;

    // Save user to db
    await user.save();

    res.send({
      status: "success",
      message: "Profile information succesfully updated",
    });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validate user input
    const { error } = updatePasswordValidation({
      oldPassword,
      newPassword,
      confirmPassword,
    });
    if (error) return res.send({ status: "error", error });

    // Get user from db
    const user = await User.findById(req.user._id);
    if (!user) return res.send({ status: "error", error: "User not found" });

    // If user exists, then check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect)
      return res.send({ status: "error", error: "Invalid old password" });

    // If password is correct, then update password
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.send({ status: "success", message: "Password successfully updated" });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.send({ status: "error", error: "User not found" });

    const buffer = req.file.buffer;

    // resize image with sharp and convert to webp
    const resizedImage = await sharp(buffer)
      .resize({ width: 500, height: 500 })
      .webp({ quality: 80 })
      .toBuffer();

    // save pic with user id
    const fileName = user._id + "-" +Date.now() + ".webp";
    const filePath = "uploads/" + fileName;
    await fs.promises.writeFile(filePath, resizedImage);

    // delete old profile pic
    if (!user.profilePic.startsWith("https://ui-avatars.com/api/")) {
      const oldFilePath = user.profilePic.split("uploads/")[1];
      fs.unlink(`uploads/${oldFilePath}`, (err) => {
        if (err) return res.send({ status: "error", error: err.message });
      });
    }
    
    // update user profile pic
    user.profilePic = `${process.env.SERVER_URL}/${filePath}`;
    await user.save();

    res.send({
      status: "success",
      message: "Profile picture successfully updated",
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { productId, comment } = req.body;

    // Get user from db
    const user = await User.findById(req.user._id);
    if (!user) return res.send({ status: "error", error: "User not found" });

    // Find Product
    const product = await Product.findById(productId);
    if (!product)
      return res.send({ status: "error", error: "Product not found" });


    // Check if user bought the product
    const userOrders = await Order.find({ user: user._id });
    
    const isUserBought = userOrders.some((order) => {
      return order.items.some((item) => {
        return item.product.toString() === productId;
      });
    });

    if (!isUserBought){
      return res.send({ status: "error", error: "You must buy the product to comment" });
    }

    // Create comment
    const newComment = {
      userId: user._id,
      comment,
    };
    // Add comment to product
    const savedComment = await product.pushComment(newComment);
    await product.save();

    const newCommentWithUser = {
      user: {
        _id: user._id,
        fullName: user.fullName,
        profilePic: user.profilePic,
      },
      comment,
      date: savedComment.date,
    };

    res.send({
      status: "success",
      message: "Comment successfully added",
      comment: newCommentWithUser,
    });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
};