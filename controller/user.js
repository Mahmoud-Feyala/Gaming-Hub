const path = require("path");
const Game = require("../model/games");
const Library = require("../model/library");

exports.getHomePage = (req, res, next) => {
  Game.fetchAll((games) => {
    const featuredGames = games
      .filter((g) => g.badge === "featured" || g.badge === "trending")
      .slice(0, 4);

    res.render("user/index", {
      pageTitle: "Gaming Hub — Gaming Review Platform",
      featuredGames,
    });
  });
};

exports.getGamesPage = (req, res, next) => {
  Game.fetchAll((game) => {
    res.render("user/games.ejs", {
      pageTitle: "Games — Gaming Hub",
      game: game,
    });
  });
};

exports.getLibraryPage = (req, res, next) => {
  Library.getLibrary((library) => {
    res.render("user/Library.ejs", {
      pageTitle: "My Library — Gaming Hub",
      games: library.games,
      totalGames: library.totalGames,
    });
  });
};

exports.postAddToLibrary = (req, res) => {
  const gameId = req.body.gameId;
  Library.addGame(gameId);
  res.redirect(`/library`);
};

exports.getLoginPage = (req, res, next) => {
  res.render("user/login.ejs", { pageTitle: "Log In — Gaming Hub" });
};

exports.getRegesterPage = (req, res, next) => {
  res.render("user/register.ejs", { pageTitle: "Create Account — Gaming Hub" });
};

exports.getGameDetailsPage = (req, res, next) => {
  const gameId = req.params.gameId;
  Game.findById(gameId, (game) => {
    if (!game) {
      return res.status(404).render("404", {
        pageTitle: "Game Not Found — Gaming Hub",
      });
    }

    res.render("user/game-details.ejs", {
      pageTitle: `${game.title} — Gaming Hub`,
      game,
    });
  });
};

exports.postDeleteFromLibrary = (req, res, next) => {
  const gameId = req.body.gameId;
  Library.deleteGame(gameId);
  res.redirect("/library");
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
