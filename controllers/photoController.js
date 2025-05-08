import { Photo } from "../models/photoModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const createPhoto = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "lenslight",
    }
  );
  try {
    const { title, description, user } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    await Photo.create({
      title,
      description,
      user: res.locals.user._id,
      url: result.secure_url,
    });

    // Remove the temporary file
    fs.unlinkSync(req.files.image.tempFilePath);

    res.status(201).redirect("/users/dashboard");
  } catch (error) {
    console.error("ERROR", error);
    res.status(400).json({
      message: error.message,
    });
  }
};

const getAllPhotos = async (req, res) => {
  try {
    const photos = res.locals.user
      ? await Photo.find({ user: { $ne: res.locals.user._id } })
      : await Photo.find({});
    if (!photos) {
      return res.status(404).json({
        message: "No photos found",
      });
    }
    // Populate the user field with the User model
    res.status(200).render("photos", { photos, link: "photos" });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById({ _id: req.params.id }).populate("user");
    res.status(200).render("photo", {
      photo,
      link: "photo",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export { createPhoto, getAllPhotos, getPhoto };
