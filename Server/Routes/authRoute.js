const express = require("express");
const {
  signup,
  signin,
  signout,
  resetPassword,
  forgotPassword,
  googleLogin,
} = require("../Controller/authController");
const {
  validateRequest,
  validateSignRequest,
  isRequestSignValidate,
  isRequestValidate,
} = require("../Validator/authValidator");
const { requireSignin } = require("../Middleware/authMiddleware");
const router = express.Router();

router.post("/signup", validateRequest, isRequestValidate, signup);

router.post("/signin", validateSignRequest, isRequestSignValidate, signin);

router.post("/logout", requireSignin, signout);

router.post("/forget", forgotPassword);

router.post("/signin/reset/", resetPassword);

router.post("/googlelogin", googleLogin);

module.exports = router;
