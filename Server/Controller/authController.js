const User = require("../model/authModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const moment = require("moment");
const Token = require("../model/tokenModel");
const sgMail = require("@sendgrid/mail");
const { OAuth2Client } = require("google-auth-library");
const host = process.env.HOST;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendingEmail = process.env.SENDING_EMAIL ;

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({
        message: "User already exist",
      });

    const {
      name,
      email,
      address,
      state,
      city,
      contactnumber,
      password,
    } = req.body;

    const hash_password = await bcrypt.hash(password, 8);

    const _user = new User({
      name,
      email,
      address,
      state,
      city,
      contactnumber,
      hash_password,
    });

    _user.save((error, data) => {
      if (data) {
        return res.status(200).json({
          user: data,
        });
      }
      if (error) {
        return res.status(400).json("Error:" + error);
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        req.header("Authorization", token);

        const { _id, name, email, address, state, city, contactnumber } = user;

        res.cookie("token", token, { expiresIn: "1d" });

        res.status(200).json({
          token,
          user: {
            _id,
            name,
            email,
            address,
            state,
            city,
            contactnumber,
          },
        });
      } else {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "SignOut Successfully....",
  });
};

exports.forgotPassword = async (req, res) => {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      return res.status(500).send({ message: "An unexpected error occurred" });
    }
    if (!user)
      return res
        .status(400)
        .send({ message: "No user found with this email address." });

    // Create a verification token
    var token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });

    user.passwordResetToken = token.token;
    user.passwordResetExpires = moment().add(12, "hours");

    user.save(function (err) {
      if (err) {
        return res
          .status(500)
          .send({ message: "An unexpected error occurred" });
      }
      // Save the token
      token.save(function (err) {
        if (err) {
          return res
            .status(500)
            .send({ message: "An unexpected error occurred" });
        }
        // Send the mail
        const mail = {
          to: user.email,
          from: `${sendingEmail}`,
          subject: "Reset password link",
          text: "Some useless text",
          html: `
          <p>You are receiving this because you (or someone else) have requested the reset of the password for your account. 
          Please click on the following link, or paste this into your browser to complete the process:
          <a href="http://${host}/signin/reset/${token.token}"> http://${host}/signin/reset/${token.token} </a>
          .If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `,
        };
        sgMail
          .send(mail)
          .then(() => {
            return res.status(200).send({
              message: `A validation email has been sent to ${user.email}`,
            });
          })
          .catch((err) => {
            return res.status(503).send({
              message: `Impossible to send an email to ${user.email}, try again. Our service may be down.`,
            });
          });
      });
    });
  });
};

exports.resetPassword = async (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({
    passwordResetToken: sentToken,
    passwordResetExpires: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ error: "Try again session expired" });
      }
      bcrypt.hash(newPassword, 12).then((hash_password) => {
        user.hash_password = hash_password;
        user.resetToken = undefined;
        user.passwordResetExpires = undefined;
        user.save().then((saveduser) => {
          res.json({ message: "password updated" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT);

exports.googleLogin = (req, res) => {
  const { idToken } = req.body;
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
    .then((response) => {
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            res.cookie("token", token, { expiresIn: "7d" });
            const { _id, email, name } = user;
            return res.json({
              token,
              user: { _id, email, name },
            });
          } else {
            let hash_password = email + process.env.JWT_SECRET;
            user = new User({ name, email, hash_password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name } = data;
              return res.json({
                token,
                user: { _id, email, name },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
};
