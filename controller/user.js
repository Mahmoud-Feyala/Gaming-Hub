const path = require("path");
// const Library = require("../model/library");
const Game = require("../model/games.js");
// const LibraryItem = require("../model/library-item.js");
// const User = require("../model/user.js");
const Review = require("../model/reviews");

exports.postReview = (req, res, next) => {
  const gameId = req.body.gameId;
  const rating = Number(req.body.rating || 5);
  const reviewText = req.body.review;

  const review = new Review({
    game: gameId,
    user: req.user._id,
    rating,
    review: reviewText,
  });

  review
    .save()
    .then(() => {
      res.redirect("/game-details/" + gameId);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getGameDetailsPage = (req, res, next) => {
  const gameId = req.params.gameId;

  Game.findById(gameId)
    .then((game) => {
      return Review.find({ game: gameId })
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .then((reviews) => {
          res.render("user/game-details", {
            pageTitle: `${game.title} — Gaming Hub`,
            game,
            reviews,
            isAuth: req.session.isLoggedIn,
          });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getHomePage = (req, res, next) => {
  Game.find()
    .then((games) => {
      console.log("isLoggedIn =", req.session.isLoggedIn);
      const featuredGames = games
        .filter((g) => g.badge === "featured" || g.badge === "trending")
        .slice(10, 14);

      Review.find()
        .populate("user", "name")
        .populate("game", "title")
        .sort({ createdAt: -1 })
        .limit(3)
        .then((reviews) => {
          res.render("user/index", {
            pageTitle: "Gaming Hub — Gaming Review Platform",
            featuredGames,
            trendingReviews: reviews,
            isAuth: req.session.isLoggedIn,
          });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getGamesPage = (req, res, next) => {
  Game.find()
    .then((games) => {
      res.render("user/games.ejs", {
        pageTitle: "Games — Gaming Hub",
        game: games,
        isAuth: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLibraryPage = (req, res, next) => {
  /** @type {InstanceType<typeof import("../model/user")>} */
  const user = req.user;
  user
    .populate("library.gameId")
    .then((user) => {
      const games = user.library.map((item) => item.gameId);

      res.render("user/Library.ejs", {
        pageTitle: "My Library — Gaming Hub",
        games: games,
        totalGames: games.length,
        isAuth: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddToLibrary = (req, res, next) => {
  /** @type {InstanceType<typeof import("../model/user.js")>} */
  const user = req.user;
  user
    .addToLibrary(req.body.gameId)
    .then(() => {
      res.redirect("/library");
    })
    .catch(next);
};

exports.getLoginPage = (req, res, next) => {
  res.render("user/login.ejs", {
    pageTitle: "Log In — Gaming Hub",
    isAuth: req.session.isLoggedIn,
  });
};

exports.postDeleteFromLibrary = (req, res, next) => {
  const gameId = req.body.gameId;
  req.user
    .removeFromLibrary(gameId)
    .then((result) => {
      console.log("Game Has Been Removed");
      res.redirect("/library");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getHelpCenterPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "support", "help.html"));
};

exports.getprivacyPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "support", "privacy.html"));
};

exports.getContactPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "support", "contact.html"));
};

exports.getTermsPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "support", "terms.html"));
};
