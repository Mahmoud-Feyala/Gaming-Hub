const path = require("path");
const Game = require("../model/games");
exports.getAdminDash = (req, res, next) => {
  res.render("admin/admin-dashboard", {
    pageTitle: "Admin Dashboard — Gaming Hub",
  });
};

exports.getAdminGames = (req, res, next) => {
  req.user
    .getGames()
    .then((games) => {
      res.render("admin/admin-games", {
        pageTitle: "All Games — Admin Panel",
        game: games,
      });
    })
    .catch((err) => {
      console.log(err);
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
  Game.findByPk(gameId)
    .then((game) => {
      res.render("admin/admin-add-game", {
        pageTitle: "Edit Game — Admin Panel",
        editing: editMode,
        game: game,
      });
    })
    .catch((err) => {
      console.log(err);
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
  req.user
    .createGame({
      title: title,
      genre: genre,
      developer: developer,
      platform: platform,
      year: year,
      badge: badge,
      imageUrl: imageUrl,
      trailerUrl: trailerUrl,
      tags: tags,
      description: description,
    })
    .then((result) => {
      console.log(result);
      res.redirect("/admin/admin-games");
    })
    .catch((err) => {
      console.log(err);
    });
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
  Game.findByPk(gameId)
    .then((game) => {
      game.id = gameId;
      game.title = updatedtitle;
      game.genre = updatedgenre;
      game.developer = updateddeveloper;
      game.platform = updatedplatform;
      game.year = updatedyear;
      game.badge = updatedbadge;
      game.imageUrl = updatedimageUrl;
      game.trailerUrl = updatedtrailerUrl;
      game.tags = updatedtags;
      game.description = updateddescription;
      return game.save();
    })
    .then((result) => {
      console.log(`Update is Done <3`);
      res.redirect("/admin/admin-games");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAdminDeleteGames = (req, res, next) => {
  const gameId = req.body.gameId;

  Game.findByPk(gameId)
    .then((game) => {
      return game.destroy();
    })
    .then((result) => {
      res.redirect("/admin/admin-games");
    })
    .catch((err) => {
      console.log(err);
    });
};
