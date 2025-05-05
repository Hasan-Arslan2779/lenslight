import User from "../models/userModal.js";
import jwt from "jsonwebtoken";

const checkUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Doğru token'ı alın
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          console.log(err.message);
          res.locals.user = null;
          next();
        } else {
          const user = await User.findById(decoded.userId);
          res.locals.user = user; // Kullanıcıyı locals'a ayarlayın
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  } catch (error) {
    console.error(error);
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
