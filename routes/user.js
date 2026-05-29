const router = require("express").Router();
const userController = require("../controller/user");

router.get("/", userController.getHomePage);
router.get("/games", userController.getGamesPage);
router.get("/Library", userController.getLibraryPage);
router.get("/login",userController.getLoginPage)
router.get("/register",userController.getRegesterPage)
router.get("/help",userController.getHelpCenterPage)
router.get("/privacy",userController.getprivacyPage)
router.get("/terms",userController.getTermsPage)
router.get("/contact",userController.getContactPage)
module.exports = router;
