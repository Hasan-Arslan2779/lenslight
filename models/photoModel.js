import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Model adı büyük harfle yazılmalı
  },
  url: {
    type: String,
    required: true,
  },
  image_id: {
    type: String,
  },
});

export const Photo = mongoose.model("Photo", photoSchema);
