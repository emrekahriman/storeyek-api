import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /\S+@\S+\.\S+/.test(v);
        },
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
    phone: String,
    address: String,
    twitter: String,
    instagram: String,
    youtube: String,
    pages: {
      about: {
        title: String,
        slug: String,
        image: String,
        content: String,
      },
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);