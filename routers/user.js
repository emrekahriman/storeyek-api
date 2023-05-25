import express from "express";
import {
  updateProfile,
  updatePassword,
  updateProfilePicture,
  createComment,
} from "../controllers/user.js";
import { createProduct } from "../controllers/admin.js";

import fileUpload from "../middlewares/multer.js";
const router = express.Router();

router.post("/product/create", createProduct);

router.post("/update-profile", updateProfile);
router.post("/update-password", updatePassword);
router.post(
  "/update-profile-picture",
  fileUpload,
  updateProfilePicture
);
router.post("/create-comment", createComment);

export default router;
