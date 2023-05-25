import Product from "../models/ProductModel.js";

export const createProduct = async (req, res) => {
  try {
    const { name, category, description, images, price, countsInStock } =
      req.body;

    const slug = name.toLowerCase().split(" ").join("-");

    const newProduct = await Product.create({
      name,
      slug,
      category,
      description,
      images,
      price,
      countsInStock,
    });

    res.send({ status: "success", product: newProduct });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
};
