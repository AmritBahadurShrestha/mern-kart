import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import CustomError from "../middlewares/error-handler.middleware";
import Product from "../models/product.model";
import Order from "../models/order.model";
import { Order_Status } from "../types/enum.types";
import Cart from "../models/cart.model";
import { sendEmail } from "../utils/nodemailer.utils";
import { generate_order_confirmation_email } from "../utils/email.utils";

// Create
export const create = asyncHandler(async (req: Request, res: Response) => {
  const { items, shipping_address } = req.body;
  const user = req.user._id;

  if (!items) {
    throw new CustomError("Items is Required", 400);
  }

  if (!shipping_address) {
    throw new CustomError("Shipping Address is Required", 400);
  }

  const address = JSON.parse(shipping_address);
  const orderItems: { product: string; quantity: string }[] = JSON.parse(items);

  // Preparing order items with price
  const order = await Promise.all(
    orderItems.map(async (item: { product: string; quantity: string }) => {
      const product = await Product.findById(item.product);

      if (!product) {
        return null;
      }

      // reducing products stock
      product.stock = Number(item.quantity);

      await product.save();

      return {
        product: product._id,
        quantity: Number(item.quantity),
        total_price: Number(item.quantity) * product.price,
      };
    })
  );

  // filter null emements
  const filteredOrderItems = order.filter((order) => order !== null);

  // calculating total amount
  const total_amount = filteredOrderItems.reduce((acc, val) => {
    return (acc += Number(val.total_price));
  }, 0);

  // Placing Order
  const newOrder = await Order.create({
    user,
    items: filteredOrderItems,
    total_amount,
    shipping_address: address,
  });

  const orderPlaced = await Order.findById(newOrder._id)
    .populate("items.product")
    .populate("user");

  // Deleting Cart After Order is Placed
  await Cart.findOneAndDelete({ user });

  await sendEmail({
    html: generate_order_confirmation_email(orderPlaced),
    subject: "Order Status",
    to: "amritshrestha0022@gmail.com",
  });

  res.status(201).json({
    message: "Order Placed Successfully",
    status: "success",
    success: true,
    data: newOrder,
  });
});

// Get All Orders (Only Admin)
export const getAllByAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await Order.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      message: "All orders fetched successfully",
      status: "success",
      success: true,
      data: orders,
    });
  }
);

// Get User Order (Only User)
export const getAllByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user._id;

    const orders = await Order.find({ user }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "All orders fetched successfully",
      status: "success",
      success: true,
      data: orders,
    });
  }
);

// Update Order Status (Admin)
export const update = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const { id } = req.params;

  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

  res.status(200).json({
    message: "All orders fetched successfully",
    status: "success",
    success: true,
    data: order,
  });
});

// Cancel Order (Only User)
export const cancel = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findByIdAndUpdate(
    id,
    { status: Order_Status.CANCELLED },
    { new: true }
  );

  res.status(200).json({
    message: "All orders Cancelled",
    status: "success",
    success: true,
    data: order,
  });
});
