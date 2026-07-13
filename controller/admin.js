const path = require("path");
const Game = require("../model/games");
const Review = require("../model/reviews");
const { validationResult } = require("express-validator");

exports.getAdminDash = (req, res, next) => {
  res.render("admin/admin-dashboard", {
    pageTitle: "Admin Dashboard — Gaming Hub",
    isAuth: req.session.isLoggedIn,
  });
};

exports.getAdminReviews = (req, res, next) => {
  Review.find()
    .populate("game", "title")
    .populate("user", "username")
    .sort({ createdAt: -1 })
    .then((reviews) => {
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
  Game.find()
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
    hasError: false,
    error: null,
    success: null,
    validationErrors: [],
    game: {
      title: "",
      genre: "",
      developer: "",
      platform: "",
      year: "",
      badge: "",
      imageUrl: "",
      trailerUrl: "",
      tags: "",
      description: "",
    },
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
      if (!game) return res.redirect("/");
      res.render("admin/admin-add-game", {
        pageTitle: "Edit Game — Admin Panel",
        editing: editMode,
        hasError: false,
        error: null,
        success: null,
        validationErrors: [],
        game: game,
        isAuth: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postAdminAddGames = (req, res, next) => {
  const {
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
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/admin-add-game", {
      pageTitle: "Add Game — Admin Panel",
      editing: false,
      hasError: true,
      error: errors.array()[0].msg,
      success: null,
      validationErrors: errors.array(),
      game: {
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
      },
      isAuth: req.session.isLoggedIn,
    });
  }

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
    .then(() => res.redirect("/admin/admin-games"))
    .catch((err) => console.log(err));
};

exports.postAdminEditGames = (req, res, next) => {
  const {
    gameId,
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
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/admin-add-game", {
      pageTitle: "Edit Game — Admin Panel",
      editing: true,
      hasError: true,
      error: errors.array()[0].msg,
      success: null,
      validationErrors: errors.array(),
      game: {
        _id: gameId,
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
      },
      isAuth: req.session.isLoggedIn,
    });
  }

  Game.findByIdAndUpdate(gameId, {
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
  })
    .then(() => res.redirect("/admin/admin-games"))
    .catch((err) => console.log(err));
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
