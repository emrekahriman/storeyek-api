import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";
import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";
import Stripe from "stripe";
import { saveOrder } from "../utils/saveOrder.js";

// Stripe secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.send({ status: "success", categories });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find(
      {
        countsInStock: { $gt: 0 },
      },
      "name slug category price images countsInStock"
    ).sort({ createdAt: -1 });

    return res.send({ status: "success", products });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({
      slug,
      countsInStock: { $gt: 0 },
    }).populate("category comments.user", "fullName profilePic");
    return res.send({ status: "success", product });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category: categorySlug } = req.params;
    const category = await Category.findOne({ slug: categorySlug });

    if (!category)
      return res.send({ status: "error", error: "Category not found" });

    const products = await Product.find(
      { category: category._id, countsInStock: { $gt: 0 } },
      "name slug category price images countsInStock"
    ).sort({ createdAt: -1 });

    return res.send({ status: "success", products });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

export const getProductsBySearch = async (req, res) => {
  try {
    const { search } = req.params;
    const products = await Product.find(
      {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
        countsInStock: { $gt: 0 },
      },
      "name slug category price images countsInStock"
    ).sort({ createdAt: -1 });

    return res.send({ status: "success", products });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "cart.items.product",
      "name slug category images price countsInStock"
    );
    if (!user) return res.send({ status: "error", error: "User not found" });

    return res.send({ status: "success", cart: user.cart });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id).populate(
      "cart.items.product"
    );
    if (!user) return res.send({ status: "error", error: "User not found" });

    const product = Product.findById(productId);
    if (!product)
      return res.send({ status: "error", error: "Product not found" });

    const updatedCart = await user.addToCart(product);

    return res.send({ status: "success", cart: updatedCart });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId).populate("cart.items.product");
    if (!user) return res.send({ status: "error", error: "User not found" });

    const product = Product.findById(productId);
    if (!product)
      return res.send({ status: "error", error: "Product not found" });

    const updatedCart = await user.removeFromCart(productId);

    return res.send({ status: "success", cart: updatedCart });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.send({ status: "error", error: "User not found" });

    const updatedCart = await user.clearCart();

    return res.send({ status: "success", cart: updatedCart });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cart } = req.body;
    // Get user from db
    const user = await User.findById(req.user._id);
    if (!user) return res.send({ status: "error", error: "User not found" });

    const updatedCart = await user.updateCart(cart);

    return res.send({ status: "success", cart: updatedCart });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user) return res.send({ status: "error", error: "User not found" });

    const orders = await Order.find({ user }).sort({
      createdAt: -1,
    });
    return res.send({ status: "success", orders });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "cart.items.product"
    );
    if (!user) return res.send({ status: "error", error: "User not found" });

    const { _id: userId, address, phone } = user;
    const items = user.cart.items;

    if (!items) return res.send({ status: "error", error: "Cart is empty" });

    const total = items.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0);

    const newOrder = await Order.create({
      user: userId,
      address,
      phone,
      items,
      total,
    });

    const order = await Order.populate(newOrder, {
      path: "user",
      select: "fullName email",
    });

    user.clearCart();

    return res.send({ status: "success", order });
  } catch (error) {
    return res.send({ status: "error", error: error.message });
  }
};

// http://localhost:5000/orders/create-checkout-session
export const createOrderStripe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "cart.items.product"
    );
    if (!user) return res.send({ status: "error", error: "User not found" });

    const cartTotal = user.cart.items.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0);

    const metaItems = user.cart.items.map((item) => {
      return {
        _id: item.product._id.toString(),
        price: item.product.price,
        quantity: item.quantity,
      };
    });

    const customer = await stripe.customers.create({
      metadata: {
        userId: user._id.toString(),
        address: user.address,
        phone: user.phone,
        items: JSON.stringify(metaItems),
        total: cartTotal,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer: customer.id,
      metadata: {
        products: JSON.stringify([
          ...user.cart.items.map((item) => {
            return {
              id: item.product._id.toString(),
              price: item.product.price,
              quantity: item.quantity,
            };
          }),
        ]),
      },
      line_items: user.cart.items.map((item) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.product.name,
              images: [...item.product.images],
            },
            unit_amount: item.product.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout?status=cancel`,
    });

    res.send({ status: "success", url: session.url });
  } catch (error) {
    console.log("error ->", error);
    return res.send({ status: "error", error: error.message });
  }
};

// http://localhost:5000/orders/webhook
export const stripeWebhook = async (req, res) => {
  try {
    let endpointSecret;

    const sig = req.headers["stripe-signature"];

    let data, eventType;

    if (endpointSecret) {
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    if (eventType === "checkout.session.completed") {
      console.log("🔔  Payment received!");
      // console.log("data -> ", data);

      // Fulfill the purchase...
      const customer = await stripe.customers.retrieve(data.customer);
      const { order, error } = await saveOrder(customer, data);

      if (error) {
        console.log("stripe webhook error ->", error);
        return res.send({ status: "error", error: error.message });
      }
    }

    res.send().end();
  } catch (error) {
    console.log("stripe webhook error ->", error);
    return res.send({ status: "error", error: error.message });
  }
};

export const getCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId)
      return res.send({ status: "error", error: "Invalid session id" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const items = JSON.parse(session.metadata.products);

    const lineItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.id).select("name images");
        return {
          ...product._doc,
          price: item.price,
          quantity: item.quantity,
        };
      })
    );
    return res.send({ status: "success", lineItems });
  } catch (error) {
    console.log("error ->", error);
    return res.send({ status: "error", error: error.message });
  }
};
