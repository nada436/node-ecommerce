
import Product from "../products/product.model.js";
import Cart from "./cart.model.js";

// Add product to cart
export const add_product = async (req, res) => {

    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: "fail", message: "Product not found" });
    }

    let cart = await Cart.findOne({ user_id: req.user._id }).populate("products.product");
    if (!cart) {
      cart = await Cart.create({ user_id: req.user._id, products: [], totalamount: 0 });
    }

    const index = cart.products.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (index > -1) {
      cart.products[index].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    // Update total amount
    await cart.populate("products.product");
    cart.totalamount = cart.products.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    await cart.save();
    res.status(200).json({ status: "success", cart });
};

// Remove product from cart
export const remove_product = async (req, res) => {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user_id: req.user._id }).populate("products.product");
    if (!cart) {
      return res.status(404).json({ status: "fail", message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (item) => item.product._id.toString() !== productId
    );

    // Update total amount
    cart.totalamount = cart.products.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    await cart.save();
    res.status(200).json({ status: "success", cart });

};

// Adjust quantity of a product
export const quantity_adjustment = async (req, res) => {
  
    const { productId } = req.params;
    const { quantity } = req.body;

    let cart = await Cart.findOne({ user_id: req.user._id }).populate("products.product");
    if (!cart) {
      return res.status(404).json({ status: "fail", message: "Cart not found" });
    }

    const index = cart.products.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (index > -1) {
      if (quantity <= 0) {
        cart.products.splice(index, 1);
      } else {
        cart.products[index].quantity = quantity;
      }
    } else {
      return res.status(404).json({ status: "fail", message: "Product not in cart" });
    }

    // Update total amount
    cart.totalamount = cart.products.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    await cart.save();
    res.status(200).json({ status: "success", cart });
  
};

// Get user's cart
export const get_cart = async (req, res) => {
    let cart = await Cart.findOne({ user_id: req.user._id }).populate("products.product");
    if (!cart) cart = { products: [], totalamount: 0 };
    res.status(200).json({ status: "success", cart });
  
};