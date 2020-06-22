const mongoose = require("mongoose");
import uniqueValidator from "mongoose-unique-validator";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true, lowercase: true, trim: true },
  lastname: { type: String, required: true, lowercase: true, trim: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
  password: { type: String, required: true, trim: true, select: false },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        unique: true,
      },
    },
  ],
});

// hashing password before saving to db
UserSchema.pre("save", function (next) {
  const saltRounds = 10;

  const hash = bcrypt.hashSync(this.password, saltRounds);
  this.password = hash;

  next();
});

// instance methods
UserSchema.methods.validatePassword = function (user, password) {
  return bcrypt.compareSync(password, user.password);
};

UserSchema.methods.getCart = function (id) {
  // find user
  return mongoose
    .model("user")
    .find({ email: id })
    .then((user) => {
      // return cart
      return user.cart;
    });
};

// unique validator
UserSchema.plugin(uniqueValidator);

const User = mongoose.model("user", UserSchema);

export default User;
