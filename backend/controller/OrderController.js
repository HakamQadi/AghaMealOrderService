import { Order } from "../model/OrderModel.js";
import { User } from "../model/userModel.js";

const createOrder = async (req, res) => {
  const {
    name,
    contact,
    userId,
    cartItems,
    discountAmount = 0,
    location,
    type,
  } = req.body;

  try {
    // Validate required fields
    if (
      !name ||
      !contact ||
      !cartItems ||
      cartItems.length === 0 ||
      !userId ||
      !type
    ) {
      return res.status(400).json({
        // message: "ID, type, and cartItems are required",
        message: "Name, ID, contact, type, and cartItems are required",
      });
    }

    // Validate type value
    if (!["pickup", "delivery"].includes(type)) {
      return res.status(400).json({
        message: "Type must be either 'pickup' or 'delivery'",
      });
    }

    // TODO get the user id from token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure numeric values
    // Format cart items and calculate totalPrice
    let totalPriceNumber = 0;
    const formattedCartItems = cartItems.map((item) => {
      const quantity = item.quantity || 1;
      const price = parseFloat(item.price);
      if (isNaN(price)) {
        throw new Error("Invalid price in cart item");
      }
      totalPriceNumber += price * quantity;
      return {
        name: item.name,
        price,
        quantity,
      };
    });

    const discountAmountNumber = parseFloat(discountAmount) || 0;

    if (isNaN(totalPriceNumber) || isNaN(discountAmountNumber)) {
      return res
        .status(400)
        .json({ message: "Invalid numeric values for prices" });
    }

    // Final total price after discount
    totalPriceNumber -= discountAmountNumber;

    // Create order
    const newOrder = await Order.create({
      name,
      contact,
      cartItems: formattedCartItems,
      totalPrice: totalPriceNumber,
      discountAmount: discountAmountNumber,
      location: location || undefined, // optional,
      type,
    });

    user.orders.push(newOrder._id);
    await user.save();

    res.status(201).json({
      message: "Order created successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllOrdersAndById = async (req, res) => {
  const { orderId } = req.query;
  try {
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json({ message: "Order found", order });
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Orders retrieved successfully",
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate({
      path: "orders",
      options: { sort: { createdAt: -1 } }, // latest first
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.orders || user.orders.length === 0) {
      return res.status(200).json({ message: "No orders found", orders: [] });
    }

    res.status(200).json({
      message: "Orders retrieved successfully",
      count: user.orders.length,
      orders: user.orders,
    });
  } catch (error) {
    console.error("Error getting user orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { isDelivered } = req.body;

  try {
    if (typeof isDelivered !== "boolean") {
      return res.status(400).json({ message: "Invalid delivery status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { isDelivered },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createOrder,
  getAllOrdersAndById,
  updateOrder,
  deleteOrder,
  getOrdersByUserId
};
