const path = require("path");
const Game = require("../model/games");
const Review = require("../model/reviews");
exports.getAdminDash = (req, res, next) => {
  res.render("admin/admin-dashboard", {
    pageTitle: "Admin Dashboard — Gaming Hub",
    isAuth: req.session.isLoggedIn,
  });
};

exports.getAdminReviews = (req, res, next) => {
  Review.find()
    .populate("game", "title")
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .then((reviews) => {
      // console.log(reviews);
      res.render("admin/admin-reviews", {
        pageTitle: "Reviews Management",
        reviews,
        isAuth: req.session.isLoggedIn,
      });
    });
};

exports.postDeleteReview = (req, res, next) => {
  Review.findByIdAndDelete(req.body.reviewId)
    .then(() => res.redirect("/admin/reviews"))
    .catch((err) => {
      console.log(err);
    });
};
exports.getAdminGames = (req, res, next) => {
  Game.find({ user: req.user._id })
    .then((games) => {
      res.render("admin/admin-games", {
        pageTitle: "All Games — Admin Panel",
        game: games,
        isAuth: req.session.isLoggedIn,
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
    isAuth: req.session.isLoggedIn,
  });
};
exports.getAdminEditGames = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const gameId = req.params.gameId;
  Game.findById(gameId)
    .then((game) => {
      res.render("admin/admin-add-game", {
        pageTitle: "Edit Game — Admin Panel",
        editing: editMode,
        game: game,
        isAuth: req.session.isLoggedIn,
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

  const game = new Game({
    title,
    genre,
    developer,
    platform,
    year,
    badge,
    imageUrl,
    trailerUrl,
    tags,
    description,
    user: req.user._id,
  });

  game
    .save()
    .then(() => {
      res.redirect("/admin/admin-games");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postAdminEditGames = (req, res, next) => {
  const gameId = req.body.gameId;
  const updatedTitle = req.body.title;
  const updatedGenre = req.body.genre;
  const updatedDeveloper = req.body.developer;
  const updatedPlatform = req.body.platform;
  const updatedYear = req.body.year;
  const updatedBadge = req.body.badge;
  const updatedImageUrl = req.body.imageUrl;
  const updatedTrailerUrl = req.body.trailerUrl;
  const updatedTags = req.body.tags;
  const updatedDescription = req.body.description;

  Game.findByIdAndUpdate(gameId, {
    title: updatedTitle,
    genre: updatedGenre,
    developer: updatedDeveloper,
    platform: updatedPlatform,
    year: updatedYear,
    badge: updatedBadge,
    imageUrl: updatedImageUrl,
    trailerUrl: updatedTrailerUrl,
    tags: updatedTags,
    description: updatedDescription,
  })
    .then(() => {
      console.log("Update is Done <3");
      res.redirect("/admin/admin-games");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAdminDeleteGames = (req, res, next) => {
  const gameId = req.body.gameId;

  Game.findByIdAndDelete(gameId)
    .then((result) => {
      res.redirect("/admin/admin-games");
    })
    .catch((err) => {
      console.log(err);
    });
};
