const router = require("express").Router();
const authController = require("../controller/auth");
const { body, check } = require("express-validator");
router.get("/login", authController.getLogin);
router.post(
  "/login",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email."),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
  authController.postLogin
);

router.get("/logout", authController.postLogout);
router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);
router.post(
  "/signup",

  body("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters."),

  body("lastName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters."),

  body(
    "username",
    "Username must contain only letters and numbers. and 3 characters"
  )
    .trim()
    .isLength({ min: 3 })
    .isAlphanumeric(),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email."),

  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match.");
    }
    return true;
  }),
  body("terms")
    .equals("on")
    .withMessage("You must accept the Terms of Service."),

  authController.postSignup
);

router.get("/forgot-password", authController.getForgotPassword);
router.post("/forgot-password", authController.postForgotPassword);

router.get("/reset-password/:token", authController.getResetPassword);
router.post("/reset-password/:token", authController.postResetPassword);

module.exports = router;
