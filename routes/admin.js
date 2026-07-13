const router = require("express").Router();
const { body } = require("express-validator"); // استدعاء الـ body
const adminController = require("../controller/admin");
const isAuth = require("../middleware/isAuth");

// الـ Validation Rules (ممكن تفصلهم في متغير لو حابب الكود يكون أنظف)
const gameValidationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Please enter a valid game title."),
  body("genre").notEmpty().withMessage("Please select a genre."),
  body("developer")
    .trim()
    .notEmpty()
    .withMessage("Developer name is required."),
  body("platform").notEmpty().withMessage("Please select a platform."),
  body("year")
    .isInt({ min: 1980, max: 2030 })
    .withMessage("Please enter a valid year between 1980 and 2030."),
  body("imageUrl")
    .isURL()
    .withMessage("Please enter a valid URL for the image."),
  body("trailerUrl")
    .isURL()
    .withMessage("Please enter a valid URL for the trailer."),
  body("tags")
    .trim()
    .notEmpty()
    .withMessage("Please provide at least one tag."),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long."),
];

router.get("/admin-dashboard", isAuth, adminController.getAdminDash);
router.get("/admin-addGames", isAuth, adminController.getAdminAddGames);
router.get(
  "/admin-editGames/:gameId",
  isAuth,
  adminController.getAdminEditGames
);
router.get("/admin-games", isAuth, adminController.getAdminGames);

router.post(
  "/add-game",
  isAuth,
  gameValidationRules,
  adminController.postAdminAddGames
);

router.post(
  "/edit-game",
  isAuth,
  gameValidationRules,
  adminController.postAdminEditGames
);

router.post("/admin-deleteGame", isAuth, adminController.postAdminDeleteGames);
router.get("/reviews", isAuth, adminController.getAdminReviews);
router.post("/delete-review", isAuth, adminController.postDeleteReview);

module.exports = router;
