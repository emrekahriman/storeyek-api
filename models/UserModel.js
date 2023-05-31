import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /\S+@\S+\.\S+/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: String,
    profilePic: String,
    address: String,
    verificationCode: String,
    verificationCodeExpires: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    cart: {
      items: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  // set default profile picture here from fullname first letters
  let replacedName = this.fullName.replace(" ", "+");
  // if profile pic is not set, then set default profile pic
  if (!this.profilePic) {
    this.profilePic = `https://ui-avatars.com/api/?name=${replacedName}&background=random&rounded=true&format=png`;
  }

  // set default cart
  this.cart = {
    items: [],
  };

  next();
});

UserSchema.methods.addToCart = async function (product) {
  const updatedCartItems = [...this.cart.items];
  const cartProductIndex = updatedCartItems.findIndex(
    (cart) => cart.product.toString() === product._id.toString()
  );

  let quantity = 1;
  if (cartProductIndex >= 0) {
    quantity = updatedCartItems[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = quantity;
  } else {
    updatedCartItems.push({
      product: product._id,
      quantity,
    });
  }

  this.cart.items = updatedCartItems;

  await this.updateOne(this);
  return this.cart;
};

UserSchema.methods.removeFromCart = async function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  this.cart.items = updatedCartItems;

  await this.updateOne(this);
  return this.cart;
};

UserSchema.methods.clearCart = async function () {
  this.cart = {
    items: [],
  };

  await this.save();
  return this.cart;
};

UserSchema.methods.updateCart = async function (cart) {
  const tempCartItems = cart.map((item) => {
    return {
      product: item.product._id,
      quantity: item.quantity,
    };
  });
  this.cart.items = tempCartItems;
  await this.updateOne(this);
  return this.cart;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
