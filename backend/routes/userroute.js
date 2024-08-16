const express = require("express");
const { User } = require("../model/user");
const router = express.Router();
const passport=require("passport")
router.get("/", async (req, res) => {
  res.json({"message":"hello from user"});
});
router.post('/register', async (req, res) => {
  try {
     let { name, email, password } = req.body;
     let newuser = new User({
       name,
       email,
     });
     let registeruser = await User.register(newuser, password);
     req.login(registeruser, (error) => {
       return res.json(error);
     });
     res.json(req.user);
  } catch (error) {
    res.json({
      "errormessage": error.message,
      "errorname":error.name
    })
  }
 
})
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login", }),
  function (req, res) {
    res.send(req.user)
  }
);
router.post('/logout', (req, res) => {
  try {
     req.logout((error) => {
       res.json(error);
     });
     res.json("the user has been log out");
  } catch (error) {
    res.json(error)
  }
 
})
module.exports = router;
