import mongoose from "mongoose";

export const connectDatabase = (uri: string) => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log("Database Connected Successfully!");
    })
    .catch((error) => {
      console.log(error);
    });
};
