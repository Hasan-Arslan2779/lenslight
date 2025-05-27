import express from "express";
import {
  //   getPhotos,
  //   getPhoto,
  createPhoto,
  deletePhoto,
  getAllPhotos,
  getPhoto,
  updatePhoto,
  //   updatePhoto,
  //   deletePhoto,
} from "../controllers/photoController.js";

const router = express.Router();
// Fotoğraf oluştur ve tüm fotoğrafları getir

router.route("/").post(createPhoto);

router.route("/").get(getAllPhotos);

router.route("/:id").get(getPhoto);
router.route("/:id").delete(deletePhoto);
router.route("/:id").put(updatePhoto);
export default router;
