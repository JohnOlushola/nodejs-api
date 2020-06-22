const mongoose = require("mongoose");
import uniqueValidator from "mongoose-unique-validator";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true, trim: true, max: 120 },
  description: { type: String, required: true, lowercase: true, trim: true },
  price: { type: Number, required: true },
  image: { type: String },
  productId: { type: String, required: true, trim: true, unique: true },
});

ProductSchema.plugin(uniqueValidator);

const Product = mongoose.model("product", ProductSchema);

export default Product;
