import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";

import pageRoute from "./routes/pageRoute.js";
import photoRoute from "./routes/photoRoute.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import { checkUser } from "./middlewares/authMiddleware.js";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
// import path from "path";
// .env dosyasındaki değişkenleri okumak için
// import { fileURLToPath } from "url";

// Dotenv'i başlat
dotenv.config();

// MongoDB'ye bağlan
connectDB();

// Cloudinary ayarları
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// // __dirname için gerekli
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Express uygulaması
const app = express();

// Port numarası
const port = 3000;

// ejs şablon motoru
app.set("view engine", "ejs");

// Server static files
app.use(express.static("public"));
// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

// Routes
app.use("*", checkUser); // Tüm sayfalarda kullanıcı kontrolü
app.use("/", pageRoute);
// About sayfası
app.get("/about", pageRoute);
// Photo
app.use("/photos", photoRoute);
app.use("/users", userRoute);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
