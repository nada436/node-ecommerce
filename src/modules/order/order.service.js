import Cart from "../cart/cart.model.js";
import Order from "./order.model.js";
import { sendEmail } from './../../utils/email/email_service.js';



export const createOrder = async (req, res) => {
    const {
      paymentMethod,
      governorate,
      city,
      street,
      // Guest fields (optional)
      guestName,
      guestEmail,
      guestPhone,
    } = req.body;
    const userId = req.user?._id || null;
    console.log("user:"+req.user._id) 
    let products = [];
    let totalAmount = 0;

    if (userId) {
      // ── Logged-in: pull from their cart ──
      const cart = await Cart.findOne({ user_id: userId }).populate(
        "products.product"
      );

      if (!cart || cart.products.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      products = cart.products.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      }));
     
      totalAmount = cart.totalamount;

      // Clear the cart after ordering
      await Cart.findOneAndDelete({ user_id: userId });
    } else {
      // ── Guest: expect products array in body ──
      // Body: { products: [{ productId, quantity, price }], ... }
      if (!req.body.products || req.body.products.length === 0) {
        return res.status(400).json({ message: "No products provided" });
      }

      products = req.body.products.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      totalAmount = products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    const order = await Order.create({
      user_id: userId,
      products,
      totalAmount,
      status: "pending",
      paymentMethod,
      shippingAddress: { governorate, city, street },
      guestInfo: !userId
        ? { name: guestName, email: guestEmail, phone: guestPhone }
        : undefined,
    });
    await sendEmail({to:req.user.email||guestEmail,type:"orderdetails",order})

    res.status(201).json({ message: "Order placed successfully", order });
  } 

  export const getMyOrders = async (req, res) => {

    const orders = await Order.find({ user_id: req.user._id })
      .populate("products.product", "name price image ")
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({ count: orders.length, orders });
  } 
