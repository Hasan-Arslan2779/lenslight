import express from "express";
import * as userController from "../controllers/userController.js";
import { getDashboardPage } from "../controllers/pageController.js";
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

export default router;
