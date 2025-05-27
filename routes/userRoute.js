import express from "express";
import * as userController from "../controllers/userController.js";
import { getDashboardPage } from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Kullanıcı oluştur
router.route("/register").post(userController.createUsers);
// Giriş yapma işlemi
router.route("/login").post(userController.loginUser);
router.route("/dashboard").get(authenticateToken, getDashboardPage);
router.route("/logout").get(userController.logoutUser);
router.route("/:id").get(authenticateToken, userController.getAUser);
router.route("/users").get(authenticateToken, userController.getUsersPage);

// Takip etme ve takipten çıkma işlemleri
router.route("/:id/follow").put(authenticateToken, userController.follow);
router.route("/:id/unfollow").put(authenticateToken, userController.unfollow);

export default router;
