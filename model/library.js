const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "..", "data", "library.json");

module.exports = class Library {
  static addGame(gameId,imageUrl) {
    fs.readFile(p, (err, fileContent) => {
      let library = { games: [],};

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
        imageUrl: imageUrl
      });

      fs.writeFile(p, JSON.stringify(library), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }
};
