import { Photo } from "../models/photoModel.js";

const getIndexPage = (req, res) => {
  res.render("index", { title: "Home", link: "index" });
};
const getAboutPage = (req, res) => {
  res.render("about", { title: "About", link: "about" });
};
const getContactPage = (req, res) => {
  res.render("contact", { title: "Contact" });
};
const getBlogPage = (req, res) => {
  res.render("blog", { title: "Blog" });
};
const getRegisterPage = (req, res) => {
  res.render("register", { title: "Register", link: "register" });
};
const getLoginPage = (req, res) => {
  res.render("login", { title: "Login", link: "login" });
};

export { getIndexPage, getAboutPage, getRegisterPage, getLoginPage };
