import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    cat_name: { type: String },
    image: { type: String, required: true },
    images: { type: [String] },
    price: { type: Number, required: true },
    price_2_year: { type: String },
    brand: { type: String, required: true },
    in_stock: { type: Number, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    color: { type: String },
    sku: { type: String, required: true },
    warehouse: { type: String },
    exp_delivery: { type: Number },
    delivery_date: { type: String },
    exp_available: { type: Number },
    ean: { type: String },
    properties: {
      full_name: { type: String },
      ean: { type: String },
      item_spec: { type: String },
      warranty: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
