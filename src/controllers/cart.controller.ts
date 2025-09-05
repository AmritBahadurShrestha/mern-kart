import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import CustomError from "../middlewares/error-handler.middleware";
import Cart from "../models/cart.model";
import Product from "../models/product.model";

//* Create
export const create = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  const { _id: userId } = req.user;

  let cart;

  if (!productId) {
    throw new CustomError("ProductId is Required", 400);
  }

  cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, total_amount: 0 });
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("Product Not Found", 400);
  }

  const isAlreadyExists = cart.items.find(
    (item: any) => item.product.toString() === productId.toString()
  );

  if (isAlreadyExists) {
    isAlreadyExists.quantity += Number(quantity);
    cart.total_amount =
      cart.total_amount -
      isAlreadyExists.total_price +
      isAlreadyExists.quantity * product.price;
    isAlreadyExists.total_price = isAlreadyExists.quantity * product.price;
  } else {
    const total_price = Number(quantity) * product.price;
    const total_amount = cart.total_amount + total_price;
    cart.total_amount = total_amount;
    cart.items.push({ total_price, product: product._id, quantity });
  }

  await cart.save();

  res.status(201).json({
    message: "Product Successfully Added To Cart",
    status: "success",
    success: true,
    data: cart,
  });
});

//* Get By User
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user._id;

  const cart = await Cart.findOne({ user }).populate('items.product');

  if (!cart) {
    throw new CustomError("Cart Not Created Yet", 400);
  }

  res.status(200).json({
    message: "Cart Successfully Retrieved",
    status: "success",
    success: true,
    data: cart
  });
});

//* Clear Cart
export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new CustomError("Cart Not Found", 404);
  }

  cart.items.splice(0, cart.items.length);
  cart.total_amount = 0;

  await cart.save();

  res.status(200).json({
    message: "Cart successfully cleared",
    status: "success",
    success: true,
    data: cart,
  });
});

//* Update Cart
export const updateCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || quantity == null) {
      throw new CustomError("ProductId and quantity are required", 400);
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new CustomError("Cart Not Found", 404);
    }

    const item = cart.items.find(
      (item: any) => item.product.toString() === productId.toString()
    );

    if (!item) {
      throw new CustomError("Product Not Found in Cart", 404);
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new CustomError("Product Not Found", 404);
    }

    cart.total_amount = cart.total_amount - item.total_price;

    item.quantity = quantity;
    item.total_price = quantity * product.price;

    cart.total_amount += item.total_price;

    await cart.save();

    res.status(200).json({
      message: "Cart Item Updated Successfully",
      status: "success",
      success: true,
      data: cart,
    });
  }
);

//* Remove Item From Cart
export const removeCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!productId) {
      throw new CustomError("ProductId is required", 400);
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new CustomError("Cart not found", 404);
    }

    // Find the item to remove
    const itemToRemove = cart.items.find(
      (item: any) => item.product.toString() === productId.toString()
    );

    if (!itemToRemove) {
      throw new CustomError("Product not found in cart", 404);
    }

    // Subtract the item's total price from total_amount
    cart.total_amount -= itemToRemove.total_price;

    // Filter out the item
    let items = cart.items.filter(
      (item: any) => item.product.toString() !== productId.toString()
    );

    cart.set("items", items);

    await cart.save();

    res.status(200).json({
      message: "Product removed from cart",
      status: "success",
      success: true,
      data: cart,
    });
  }
);
