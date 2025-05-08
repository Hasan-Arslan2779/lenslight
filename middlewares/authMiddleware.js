import User from "../models/userModal.js";
import jwt from "jsonwebtoken";

const checkUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          console.log("JWT Verify Error:", err.message);
          res.locals.user = null;
          next();
        } else {
          const user = await User.findById(decoded.userId);
          if (!user) {
            console.log("User not found for ID:", decoded.userId);
            res.locals.user = null;
          } else {
            res.locals.user = user;
          }
          next();
        }
      });
    } else {
      console.log("No JWT Token found in cookies");
      res.locals.user = null;
      next();
    }
  } catch (error) {
    console.error("Error in checkUser middleware:", error.message);
    res.locals.user = null;
    next();
  }
};

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Doğru token'ı alın
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log(err.message);
          return res.redirect("/login");
        } else {
          req.user = decoded; // Kullanıcı bilgilerini req.user'a ekleyin
          next();
        }
      });
    } else {
      return res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export { authenticateToken, checkUser };
