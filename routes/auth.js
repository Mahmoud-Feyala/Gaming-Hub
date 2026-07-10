const router = require("express").Router();
const authController = require("../controller/auth");

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/logout", authController.postLogout);
router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

router.get("/forgot-password", authController.getForgotPassword);
router.post("/forgot-password", authController.postForgotPassword);

router.get("/reset-password/:token", authController.getResetPassword);
router.post("/reset-password/:token", authController.postResetPassword);

module.exports = router;