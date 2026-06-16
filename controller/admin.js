const path = require("path");
const Game = require("../model/games");
exports.getAdminDash = (req, res, next) => {
  res.render("admin/admin-dashboard", {
    pageTitle: "Admin Dashboard — Gaming Hub",
  });
};

exports.getAdminGames = (req, res, next) => {
  Game.fetchAll((game) => {
    res.render("admin/admin-games", {
      pageTitle: "All Games — Admin Panel",
      game: game,
    });
  });
};
exports.getAdminAddGames = (req, res, next) => {
  res.render("admin/admin-add-game", {
    pageTitle: "Add Game — Admin Panel",
    editing: false,
  });
};
exports.getAdminEditGames = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const gameId = req.params.gameId;
  Game.findById(gameId, (game) => {
    if (!game) {
      return req.redirect("/");
    }
    res.render("admin/admin-add-game", {
      pageTitle: "Edit Game — Admin Panel",
      editing: editMode,
      game: game,
    });
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
  const trailerUrl = req.body.trailerUrl;
  const tags = req.body.tags;
  const description = req.body.description;

  const game = new Game(
    null,
    title,
    genre,
    developer,
    platform,
    year,
    badge,
    imageUrl,
    trailerUrl,
    tags,
    description
  );
  game.save();
  res.redirect("/admin/admin-games");
};
exports.postAdminEditGames = (req, res, next) => {
  const gameId = req.body.gameId;
  const updatedtitle = req.body.title;
  const updatedgenre = req.body.genre;
  const updateddeveloper = req.body.developer;
  const updatedplatform = req.body.platform;
  const updatedyear = req.body.year;
  const updatedbadge = req.body.badge;
  const updatedimageUrl = req.body.imageUrl;
  const updatedtrailerUrl = req.body.trailerUrl;
  const updatedtags = req.body.tags;
  const updateddescription = req.body.description;

  const updatedgame = new Game(
    gameId,
    updatedtitle,
    updatedgenre,
    updateddeveloper,
    updatedplatform,
    updatedyear,
    updatedbadge,
    updatedimageUrl,
    updatedtrailerUrl,
    updatedtags,
    updateddescription
  );
  updatedgame.save();
  res.redirect("/admin/admin-games");
};

exports.postAdminDeleteGames = (req, res, next) => {
  const gameId = req.body.gameId;

  Game.delGame(gameId);

  res.redirect("/admin/admin-games");
};
