const router = require("express").Router();
const adminController = require("../controller/admin");

router.get("/admin-dashboard", adminController.getAdminDash);
router.get("/admin-addGames", adminController.getAdminAddGames);
router.get("/admin-editGames/:gameId", adminController.getAdminEditGames);
router.get("/admin-games", adminController.getAdminGames);
router.post("/add-game", adminController.postAdminAddGames);
router.post("/edit-game", adminController.postAdminEditGames);
router.post("/admin-deleteGame", adminController.postAdminDeleteGames);
router.get("/reviews", adminController.getAdminReviews);

router.post("/delete-review", adminController.postDeleteReview);

module.exports = router;
