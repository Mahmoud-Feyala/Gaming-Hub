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
    title,
    genre,
    developer,
    platform,
    year,
    badge,
    imageUrl,
    tags,
    description
  ) {
    this.title = title;
    this.genre = genre;
    this.developer = developer;
    this.platform = platform;
    this.year = year;
    this.badge = badge;
    this.imageUrl = imageUrl;
    this.tags = tags;
    this.description = description;
  }

  save() {
    this.id = Math.random;

    getGameFromFile((games) => {
      games.push(this);
      fs.writeFile(p, JSON.stringify(games), (err) => {
        if (err) {
          console.error("Failed to save game:", err);
        }
      });
    });
  }

  static fetchAll(cb) {
    getGameFromFile(cb);
  }
};
