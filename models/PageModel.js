import mongoose from "mongoose";

const PageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Page || mongoose.model("Page", PageSchema);
