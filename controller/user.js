const path = require("path");
const Library = require("../model/library");
const Game = require("../model/games.js");
const LibraryItem = require("../model/library-item.js");
const User = require("../model/user.js");

exports.getHomePage = (req, res, next) => {
  Game.findAll()
    .then((games) => {
      const featuredGames = games
        .filter((g) => g.badge === "featured" || g.badge === "trending")
        .slice(0, 4);

      res.render("user/index", {
        pageTitle: "Gaming Hub — Gaming Review Platform",
        featuredGames,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getGamesPage = (req, res, next) => {
  Game.findAll()
    .then((games) => {
      res.render("user/games.ejs", {
        pageTitle: "Games — Gaming Hub",
        game: games,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLibraryPage = (req, res, next) => {
  req.user
    .getLibrary((library) => {
      return library;
    })
    .then((library) => {
      console.log(library);
      return library.getGames();
    })
    .then((games) => {
      console.log(games);
      res.render("user/Library.ejs", {
        pageTitle: "My Library — Gaming Hub",
        games: games,
        totalGames: games.length,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddToLibrary = (req, res) => {
  const gameId = req.body.gameId;
  let fetchedLib;
  req.user
    .getLibrary()
    .then((library) => {
      fetchedLib = library;
      return library.getGames({ where: { id: gameId } });
    })
    .then((games) => {
      let game;
      if (games.lenght > 0) {
        game = games[0];
      }
      if (game) {
        console.log("its in the lib arl");
      }
      return Game.findByPk(gameId);
    })
    .then((game) => {
      return fetchedLib.addGame(game);
    })
    .then(() => {
      res.redirect(`/library`);
    })
    .catch();
};

exports.getLoginPage = (req, res, next) => {
  res.render("user/login.ejs", { pageTitle: "Log In — Gaming Hub" });
};

exports.getRegesterPage = (req, res, next) => {
  res.render("user/register.ejs", { pageTitle: "Create Account — Gaming Hub" });
};

exports.getGameDetailsPage = (req, res, next) => {
  const gameId = req.params.gameId;
  Game.findByPk(gameId)
    .then((game) => {
      res.render("user/game-details.ejs", {
        pageTitle: `${game.title} — Gaming Hub`,
        game,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteFromLibrary = (req, res, next) => {
  const gameId = req.body.gameId;
  console.log(gameId);
  req.user
    .getLibrary()
    .then((library) => {
      return library.getGames({ where: { id: gameId } });
    })
    .then((games) => {
      console.log(games);
      let game = games[0];

      return game.libraryItem.destroy();
    })
    .then(() => {
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
