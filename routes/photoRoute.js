import express from "express";
import {
  //   getPhotos,
  //   getPhoto,
  createPhoto,
  getAllPhotos,
  getPhoto,
  //   updatePhoto,
  //   deletePhoto,
} from "../controllers/photoController.js";

const router = express.Router();
// Fotoğraf oluştur ve tüm fotoğrafları getir

router.route("/").post(createPhoto);

router.route("/").get(getAllPhotos);

router.route("/:id").get(getPhoto);
export default router;
