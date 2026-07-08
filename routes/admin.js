const router = require("express").Router();
const adminController = require("../controller/admin");
const isAuth = require("../middleware/isAuth");
router.get("/admin-dashboard", isAuth, adminController.getAdminDash);
router.get("/admin-addGames", isAuth, adminController.getAdminAddGames);
router.get(
  "/admin-editGames/:gameId",
  isAuth,
  adminController.getAdminEditGames
);
router.get("/admin-games", isAuth, adminController.getAdminGames);
router.post("/add-game", isAuth, adminController.postAdminAddGames);
router.post("/edit-game", isAuth, adminController.postAdminEditGames);
router.post("/admin-deleteGame", isAuth, adminController.postAdminDeleteGames);
router.get("/reviews", isAuth, adminController.getAdminReviews);

router.post("/delete-review", isAuth, adminController.postDeleteReview);

module.exports = router;
