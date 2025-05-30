import User from "../models/userModal.js";
import { Photo } from "../models/photoModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const createUsers = async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ message: "User Created" });
  } catch (error) {
    console.log("ERROR", error);

    let errors2 = {};

    if (error.code === 11000) {
      errors2.email = "The Email is already registered";
      errors2.userName = "The UserName is already registered";
    }

    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach((key) => {
        errors2[key] = error.errors[key].message;
      });
    }

    res.status(400).json(errors2);
  }
};
// Giriş yapma işlemi
const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  try {
    // Kullanıcıyı bul
    const user = await User.findOne({ userName });
    // Kullanıcıyı kontrol et
    let same = false;
    // Şifreyi kontrol et
    if (user) {
      same = await bcrypt.compare(password, user.password);
    }
    // Kullanıcıyı bulamazsa hata döndür
    else {
      return res.status(401).json({ message: "User not found" });
    }

    // Giriş başarılı
    if (same) {
      const token = createToken(user._id);
      res.cookie("jwt", token, {
        // Token süresi
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
      res.redirect("/users/dashboard");
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("jwt"); // Token'ı temizle
  res.redirect("/login");
};
// Kullanıcı giriş yaptıktan sonra token oluşturulur
// Token, kullanıcı bilgilerini içerir
// Token, kullanıcı kimliğini doğrulamak için kullanılır
// Token, JWT (JSON Web Token) kullanılarak oluşturulur

const createToken = (userId) => {
  // Token oluşturma
  // JWT_SECRET, .env dosyasından okunur

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    // Token süresi
    expiresIn: "1h",
  });
};

// Kullanıcıların listelendiği sayfa
const getUsersPage = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: res.locals.user._id } }); // Veritabanından kullanıcıları al
    res.render("users", { users, link: "Users" }); // users değişkenini gönder
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).send("Internal Server Error");
  }
};

// dsahboard sayfası
const getDashboardPage = async (req, res) => {
  try {
    const photos = await Photo.find({ user: res.locals.user._id });
    const user = await User.findById(res.locals.user._id).populate([
      { path: "followings", select: "userName _id" },
      { path: "followers", select: "userName _id" },
    ]);

    if (!user) {
      return res.redirect("/login");
    }

    res.render("dashboard", {
      user: user,
      title: "Dashboard",
      link: "dashboard",
      photos: photos,
    });
  } catch (error) {
    console.error("Error in getDashboardPage:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

// Kullanıcı profili sayfası
const getAUser = async (req, res) => {
  try {
    const photos = await Photo.find({
      user: req.params.id,
    });
    const user = await User.findById({
      _id: req.params.id,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Kullanıcıyı kontrol et
    const infollowers = user.followers.some(
      (follower) => follower.toString() === res.locals.user._id.toString()
    );

    res.render("user", { user, infollowers, photos, link: "Users" });
  } catch (error) {
    console.error("Error in getAUser:", error.message);
    res.status(400).json({
      message: error.message,
    });
  }
};

// Takip etme işlemi
const follow = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { followers: res.locals.user._id } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      res.locals.user._id,
      { $push: { followings: req.params.id } },
      { new: true }
    );

    // Fotoğrafları çek
    const photos = await Photo.find({ user: user._id });

    const infollowers = user.followers.some(
      (follower) => follower.toString() === res.locals.user._id.toString()
    );

    res.status(200).redirect(`/users/${req.params.id}`, {
      user,
      infollowers,
      photos,
      title: "User",
      link: "Users",
    });
  } catch (error) {
    console.error("Error in follow function:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const unfollow = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { followers: res.locals.user._id } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      res.locals.user._id,
      { $pull: { followings: req.params.id } },
      { new: true }
    );

    // Fotoğrafları çek
    const photos = await Photo.find({ user: user._id });

    const infollowers = user.followers.some(
      (follower) => follower.toString() === res.locals.user._id.toString()
    );

    res.status(200).redirect(`/users/${req.params.id}`, {
      user,
      infollowers,
      photos,
      title: "User",
      link: "Users",
    });
  } catch (error) {
    console.error("Error in unfollow function:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export {
  createUsers,
  loginUser,
  createToken,
  logoutUser,
  getAUser,
  getUsersPage,
  getDashboardPage,
  follow,
  unfollow,
};
