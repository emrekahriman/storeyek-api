import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";

export const saveOrder = async (customer, data) => {
  try {
    const {
      userId,
      phone,
      address,
      items: stringifiedItems,
    } = customer.metadata;

    const user = await User.findById(userId);
    if (!user) return { order: null, error: "User not found" };

    const email = user.email;
    const customerItems = JSON.parse(stringifiedItems);

    let orderItems = customerItems.map((item) => {
      const { _id, price, quantity } = item;
      const product = _id;
      return { product, price, quantity };
    });

    const newOrder = await Order.create({
      user: userId,
      paymentIntentId: data.payment_intent,
      address,
      phone,
      items: orderItems,
      paymentStatus: data.payment_status,
      total: data.amount_total / 100,
    });

    // Clear user cart
    user.cart.items = [];
    await user.save();

    // Update product stock
    // for (const item of customerItems) {
    //   const product = await Product.findByIdAndUpdate(
    //     item._id,
    //     {
    //       $inc: { countsInStock: -item.quantity },
    //     },
    //     { new: true }
    //   );
    // }

    // use updateMany instead of for loop
    const filter = { _id: { $in: customerItems.map((item) => item._id) } };
    const update = { $inc: { countsInStock: -1 } };

    const updatedProducts = await Product.updateMany(filter, update);
    console.log("updatedProducts :>> ", updatedProducts);

    return { order: newOrder, error: null };
  } catch (error) {
    return { order: null, error: error.message };
  }
};
