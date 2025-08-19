import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { connectDatabase } from "./config/db.config";
import CustomError, {
  errorHandler,
} from "./middlewares/error-handler.middleware";
import cookieParser from "cookie-parser";

// Importing Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import brandRoutes from "./routes/brand.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import wishListRoutes from "./routes/wish_list.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI ?? "";

const app = express();

// Connect DB
connectDatabase(DB_URI);

// Using Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Using Cookie Parser
app.use(cookieParser());

// Serving uploads as static file
app.use("/api/uploads", express.static("uploads/"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is Up & Running",
  });
});

// Using Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/wish_list", wishListRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

app.all("/{*all}", (req: Request, res: Response, next: NextFunction) => {
  const message = `Can not ${req.method} on ${req.originalUrl}`;
  const err: any = new CustomError(message, 404);
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server is Running at http://localhost:${PORT}`);
});

// Using Error Handler
app.use(errorHandler);
