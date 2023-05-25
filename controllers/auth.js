import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import registerValidation from "../validations/registerValidation.js";
import loginValidation from "../validations/loginValidation.js";
import forgotPasswordValidation from "../validations/forgotPasswordValidation.js";
import resetPasswordValidation from "../validations/resetPasswordValidation.js";
import sendEmail from "../utils/sendEmail.js";

export const register = async (req, res) => {
  try {
    const { fullName, phone, email, password, confirmPassword } = req.body;
    const { error } = registerValidation({
      fullName,
      phone,
      email,
      password,
      confirmPassword,
    });
    if (error) return res.send({ status: "error", error });

    // If validation is successful, then check if the user already exists
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (user)
      return res.send({ status: "error", error: "User already exists" });

    // If user does not exist, then create a new user
    const verificationCode = crypto.randomBytes(32).toString("hex");
    const newUser = await User.create({
      fullName,
      phone,
      email,
      password: hashedPassword,
      verificationCode,
    });

    const url = `${process.env.CLIENT_URL}/verify-email/${newUser._id}/${newUser.verificationCode}`;
    const { error: sendMailError } = await sendEmail({
      email,
      subject: "Verify your email address",
      mailType: "verifyEmail",
      data: {
        fullName,
        url,
      },
    });
    if (sendMailError)
      return res.send({ status: "error", error: sendMailError });

    res.send({
      status: "success",
      message: "Account created. Please verify your email.",
      user: newUser,
    });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      verificationCode: req.params.verificationCode,
    });

    if (!user) {
      return res.send({
        status: "error",
        error: "Invalid url.",
      });
    }

    // check user verification code is expired
    const userExpireDate = new Date(user.verificationCodeExpires);
    const currentDate = new Date();

    if (userExpireDate < currentDate) {
      const verificationCode = crypto.randomBytes(32).toString("hex");
      await User.updateOne(
        { _id: user._id },
        {
          verificationCode,
          verificationCodeExpires: Date.now() + 3600000, // 1 hour
        }
      );
      const url = `${process.env.CLIENT_URL}/verify-email/${user._id}/${verificationCode}`;
      const { error: sendMailError } = await sendEmail({
        email: user.email,
        subject: "Verify your email address",
        mailType: "verifyEmail",
        data: {
          fullName: user.fullName,
          url,
        },
      });
      if (sendMailError)
        return res.send({ status: "error", error: sendMailError });

      return res.send({
        status: "resend",
        message:
          "Verification code is expired. New verification code has been sent to your email.",
      });
    }

    await User.updateOne(
      { _id: req.params.id },
      {
        isVerified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      }
    );

    res.send({
      status: "success",
      message: "Your account has been successfully verified.",
    });
  } catch (error) {
    res.send({
      status: "error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = loginValidation({ email, password });
    if (error) return res.send({ status: "error", error });

    // If validation is successful, then check if the user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.send({ status: "error", error: "User does not exist" });

    // If user exists, then check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.send({ status: "error", error: "Invalid password" });

    // If password is correct. check if the user is verified
    if (!user.isVerified) {
      const verificationCode = crypto.randomBytes(32).toString("hex");
      await User.updateOne(
        { _id: user._id },
        {
          verificationCode,
          verificationCodeExpires: Date.now() + 3600000, // 1 hour
        }
      );
      const url = `${process.env.CLIENT_URL}/verify-email/${user._id}/${verificationCode}`;

      const { error: sendMailError } = await sendEmail({
        email,
        subject: "Verify your email address",
        mailType: "verifyEmail",
        data: {
          fullName: user.fullName,
          url,
        },
      });
      if (sendMailError)
        return res.send({ status: "error", error: sendMailError });

      return res.send({
        status: "not-verified",
        message:
          "Your account is not verified. Verification email sent. Please check your email.",
      });
    }
    // If user is verified, then create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const { password: userPassword, ...userWithoutPassword } = user._doc;
    res.send({ status: "success", tokenYek: token, user: userWithoutPassword });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = forgotPasswordValidation({ email });
    if (error) return res.send({ status: "error", error });

    const user = await User.findOne({ email });
    if (!user)
      return res.send({ status: "error", error: "User does not exist" });

    const resetPasswordToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // 1 hour
    );

    await User.updateOne({ _id: user._id }, { resetPasswordToken });

    const url = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;
    const { error: sendMailError } = await sendEmail({
      email,
      subject: "Reset your password",
      mailType: "resetPassword",
      data: {
        fullName: user.fullName,
        url,
      },
    });
    if (sendMailError)
      return res.send({ status: "error", error: sendMailError });

    res.send({
      status: "success",
      message:
        "Reset password link sent to your email. Please check your email.",
    });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
};

export const checkResetPasswordToken = async (req, res) => {
  try {
    const { resetToken } = req.body;

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded._id });
    if (!user) return res.send({ status: "error", error: "User not found" });

    if (user.resetPasswordToken !== resetToken)
      return res.send({ status: "error", error: "Invalid token" });

    res.send({ status: "success", message: "Token is valid" });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  // forgot-password ile verilen tokeni client'da forma ekleyip buraya gönderiyoruz.
  try {
    const { token, password } = req.body;

    const { error } = resetPasswordValidation({ password });
    if (error) return res.send({ status: "error", error });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });
    if (!user) return res.send({ status: "error", error: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.updateOne(
      { _id: decoded._id },
      { password: hashedPassword, resetPasswordToken: null }
    );

    res.send({
      status: "success",
      message: "Your password has been successfully changed.",
    });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
};
