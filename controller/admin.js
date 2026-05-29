const path = require("path");
const Game = require("../model/games");
exports.getAdminDash = (req, res, next) => {
  res.render("admin/admin-dashboard", {
    pageTitle: "Admin Dashboard — Gaming Hub",
  });
};

exports.getAdminGames = (erq, res, next) => {
  Game.fetchAll((game) => {
    res.render("admin/admin-games", {
      pageTitle: "All Games — Admin Panel",
       game:game
    });
  });
};
exports.getAdminAddGames = (erq, res, next) => {
  res.render("admin/admin-add-game", {
    pageTitle: "Add Game — Admin Panel",
  });
};
exports.postAdminAddGames = (req, res, next) => {
  const title = req.body.title;
  const genre = req.body.genre;
  const developer = req.body.developer;
  const platform = req.body.platform;
  const year = req.body.year;
  const badge = req.body.badge;
  const imageUrl = req.body.imageUrl;
  const tags = req.body.tags;
  const description = req.body.description;

  const game = new Game(
    title,
    genre,
    developer,
    platform,
    year,
    badge,
    imageUrl,
    tags,
    description,
  );
  game.save();
  res.redirect("/admin/admin-games");
};
