import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 },
  fileFilter: (req, file, cb) => {
    const imageRegex = /\.(png|jpg|jpeg)$/i;
    if (imageRegex.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

const fileUpload = (req, res, next) => {
  upload.single("profilePicture")(req, res, (err) => {
    if (err) {
      return res.send({
        status: "error",
        message: "File upload Error: " + err.message,
      });
    } else {
      next();
    }
  });
};

export default fileUpload;
