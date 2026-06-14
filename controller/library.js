const Library = require("../model/library");

exports.postAddToLibrary = (req, res) => {
  const gameId = req.body.gameId;
  const imageUrl = req.body.imageUrl;
  
  Library.addGame(gameId,imageUrl);

  res.redirect("/library");
};