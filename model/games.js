const fs = require("fs");
const path = require("path");
let gamearr = [];
const p = path.join(__dirname, "../", "data", "games.json");

const getGameFromFile = (cb) => {
  fs.readFile(p, (err, filecontent) => {
    if (!err && filecontent.length > 0) {
      return cb(JSON.parse(filecontent));
    }
    cb([]);
  });
};

module.exports = class Game {
  constructor(
    id,
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
  ) {
    this.id = id;
    this.title = title;
    this.genre = genre;
    this.developer = developer;
    this.platform = platform;
    this.year = year;
    this.badge = badge;
    this.imageUrl = imageUrl;
    this.trailerUrl = trailerUrl;
    this.tags = tags;
    this.description = description;
  }

  save() {
    getGameFromFile((games) => {
      if (this.id) {
        const exsistingGameIndex = games.findIndex((g) => g.id === this.id);
        const updatedGames = [...games];
        updatedGames[exsistingGameIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedGames), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        games.push(this);
        fs.writeFile(p, JSON.stringify(games), (err) => {
          if (err) {
            console.error("Failed to save game:", err);
          }
        });
      }
    });
  }

  static delGame(id) {
    getGameFromFile((games) => {
      const updatedGames = games.filter((g) => g.id !== id);
      fs.writeFile(p, JSON.stringify(updatedGames), (err) => {
        if (err) {
          console.error("Failed to save game:", err);
        }
      });
    });
  }

  static fetchAll(cb) {
    getGameFromFile(cb);
  }

  static findById(id, cb) {
    getGameFromFile((games) => {
      const game = games.find((g) => g.id === id);
      cb(game);
    });
  }
};
