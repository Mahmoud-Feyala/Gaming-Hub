const fs = require("fs");
const path = require("path");
const Games = require("./games");
const p = path.join(__dirname, "..", "data", "library.json");

module.exports = class Library {
  static addGame(gameId) {
    Games.findById(gameId, (game) => {
      fs.readFile(p, (err, fileContent) => {
        let library = { games: [], totalGames: 0 };

        if (!err && fileContent.length > 0) {
          library = JSON.parse(fileContent);
        }

        const existingGameIndex = library.games.findIndex(
          (g) => g.gameId === gameId
        );

        const existingGame = library.games[existingGameIndex];

        if (existingGame) {
          console.log("Game already exists!");
          return;
        }

        library.games.push({
          gameId: gameId,
          title: game.title,
          genre: game.genre,
          developer: game.developer,
          platform: game.platform,
          year: game.year,
          badge: game.badge,
          imageUrl: game.imageUrl,
          trailerUrl: game.trailerUrl,
          tags: game.tags,
          description: game.description,
        });

        library.totalGames = library.games.length;

        fs.writeFile(p, JSON.stringify(library), (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    });
  }

  static deleteGame(id) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedLib = JSON.parse(fileContent);
      updatedLib.games = updatedLib.games.filter((g) => g.gameId !== id);
      updatedLib.totalGames = updatedLib.games.length;
      fs.writeFile(p, JSON.stringify(updatedLib), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static getLibrary(cb) {
    fs.readFile(p, (err, fileContent) => {
      const library = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(library);
      }
    });
  }
};


