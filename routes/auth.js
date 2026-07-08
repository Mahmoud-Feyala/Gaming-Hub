const router = require("express").Router();

const authController = require("../controller/auth");

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);
router.get("/logout", authController.postLogout);
router.post("/logout", authController.postLogout);
router.get("/signup", authController.getregisterPage);
router.post("/signup", authController.postSignup);
module.exports = router;
