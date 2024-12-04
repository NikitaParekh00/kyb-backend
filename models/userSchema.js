import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    MRN: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    boothNo: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    voterSerialNo: {
      type: Number, // Correct the type based on your example
      required: true,
    },
    mobile: {
      type: String,
      required: false, // Adjust based on your requirements
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("harshita website", userSchema);
