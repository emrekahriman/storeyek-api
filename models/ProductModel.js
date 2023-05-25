import mongoose, { mongo } from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: { type: String, required: true },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  price: { type: Number, required: true },
  countsInStock: { type: Number, required: true },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

ProductSchema.methods.pushComment = async function ({ userId, comment }) {
  this.comments.push({
    user: new mongoose.Types.ObjectId(userId),
    comment,
  });
  await this.save();
  return this.comments;
};

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);

// Example product:
// {
//   "name": "Nike Air Max 270 React",
//   "slug": "nike-air-max-270-react",
//   "category": "5f9f1b0b0b1b0b0b0b0b0b0b",
//   "description": "The Nike Air Max 270 React is a new hybrid model that combines the Air Max 270 and React foam. The upper is made of a combination of mesh and synthetic materials, while the React foam midsole provides a soft and comfortable ride. The Air Max 270 React is available in a variety of colors and is a great choice for everyday wear.",
//   "image": [
//     "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/3b9b8b1a-1b1a-4b1a-9b1a-1b1a1b1a1b1a/air-max-270-react-shoe-1JXGxg.jpg",
//     "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/3b9b8b1a-1b1a-4b1a-9b1a-1b1a1b1a1b1a/air-max-270-react-shoe-1JXGxg.jpg",
//     "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/3b9b8b1a-1b1a-4b1a-9b1a-1b1a1b1a1b1a/air-max-270-react-shoe-1JXGxg.jpg"
//   ],
//   "price": 120,
//   "countInStock": 10,
//   "comments": [
//     {
//       "user": "5f9f1b0b0b1b0b0b0b0b0b0b",
//       "comment": "This is a comment",
//       "date": "2020-11-01T20:00:00.000Z"
//     }
//   ]
// }
