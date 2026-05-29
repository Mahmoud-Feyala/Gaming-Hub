const path = require('path')
const Game = require("../model/games");
exports.getHomePage = (req, res, next) => {
  res.render("user/index", {
    pageTitle: "Gaming Hub — Gaming Review Platform ",
  });
};

exports.getGamesPage = (req, res, next) => {
   Game.fetchAll((game) => {
    res.render("user/games.ejs", {
      pageTitle: "Games — Gaming Hub",
       game:game
    });
  });
};
exports.getLibraryPage = (req, res, next) => {
  res.render("user/Library.ejs", { pageTitle: "My Library — Gaming Hub"});
};
exports.getLoginPage = (req, res, next) => {
  res.render("user/login.ejs", { pageTitle: "Log In — Gaming Hub" });
};
exports.getRegesterPage = (req, res, next) => {
  res.render("user/register.ejs", { pageTitle: "Create Account — Gaming Hub" });
};
exports.getHelpCenterPage = (req, res, next) => {
  res.sendFile(path.join(__dirname,"..","views","support","help.html"));
};
exports.getprivacyPage = (req, res, next) => {
  res.sendFile(path.join(__dirname,"..","views","support","privacy.html"));
};
exports.getContactPage = (req, res, next) => {
  res.sendFile(path.join(__dirname,"..","views","support","contact.html"));
};
exports.getTermsPage = (req, res, next) => {
  res.sendFile(path.join(__dirname,"..","views","support","terms.html"));
};
