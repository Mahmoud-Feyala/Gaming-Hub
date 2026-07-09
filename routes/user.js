const router = require("express").Router();
const userController = require("../controller/user");
const isAuth = require("../middleware/isAuth");

router.get("/", userController.getHomePage);
router.get("/games", userController.getGamesPage);
router.get("/Library", isAuth, userController.getLibraryPage);
router.get("/game-details/:gameId",  userController.getGameDetailsPage);
router.post("/add-to-library", isAuth, userController.postAddToLibrary);
router.post(
  "/delete-from-library",
  isAuth,
  userController.postDeleteFromLibrary
);
router.get("/help", userController.getHelpCenterPage);
router.get("/privacy", userController.getprivacyPage);
router.post("/reviews", isAuth, userController.postReview);
router.get("/terms", userController.getTermsPage);
router.get("/contact", userController.getContactPage);

module.exports = router;
