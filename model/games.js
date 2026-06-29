const mongodb = require("mongodb");

const getDb = require("../util/database").getDb;

class Game {
  constructor(
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
    id
  ) {
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
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    /** @type {import('mongodb').Db} */
    const db = getDb();
    let dbOpr;
    if (this._id) {
      dbOpr = db
        .collection("Games")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOpr = db.collection("Games").insertOne(this);
    }
    return dbOpr
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    /** @type {import('mongodb').Db} */
    const db = getDb();

    return db
      .collection("Games")
      .find()
      .toArray()
      .then((games) => {
        return games;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(gameId) {
    /** @type {import('mongodb').Db} */
    const db = getDb();

    return db
      .collection("Games")
      .findOne({ _id: new mongodb.ObjectId(gameId) })
      .then((game) => {
        return game;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteById(gameId) {
    /** @type {import('mongodb').Db} */
    const db = getDb();
    return db
      .collection("Games")
      .deleteOne({ _id: new mongodb.ObjectId(gameId) })
      .then(() => {
        console.log("Deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

// const Game = sequelize.define("game", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },

//   title: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },

//   genre: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },

//   developer: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },

//   platform: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },

//   year: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },

//   badge: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },

//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },

//   trailerUrl: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },

//   tags: {
//     type: Sequelize.TEXT,
//     allowNull: true,
//   },

//   description: {
//     type: Sequelize.TEXT,
//     allowNull: false,
//   },
// });

module.exports = Game;
