const router = require("express").Router();
const userController = require("../controller/user");
router.get("/", userController.getHomePage);
router.get("/games", userController.getGamesPage);
router.get("/Library", userController.getLibraryPage);
router.get("/game-details/:gameId", userController.getGameDetailsPage);
router.post("/add-to-library", userController.postAddToLibrary);
router.post("/delete-from-library", userController.postDeleteFromLibrary);
router.get("/help", userController.getHelpCenterPage);
router.get("/privacy", userController.getprivacyPage);
router.post("/reviews", userController.postReview);
router.get("/terms", userController.getTermsPage);
router.get("/contact", userController.getContactPage);

module.exports = router;
