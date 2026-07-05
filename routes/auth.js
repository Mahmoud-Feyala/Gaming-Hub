const router = require("express").Router();

const authController = require("../controller/auth");

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);
router.get("/logout", authController.postLogout);
router.post("/logout", authController.postLogout);
router.get("/register", authController.getRegesterPage);
module.exports = router;
