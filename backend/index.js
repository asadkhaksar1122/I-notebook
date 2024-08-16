const express = require('express')
const app = express()
const port = 8000
const noteroute=require("./routes/notesroute")
const mongoose = require('mongoose');
const cors = require("cors");
const session = require("express-session")
const MongoStore = require("connect-mongo");
const passport =require("passport")
const LocalStrategy = require("passport-local")
const { User } = require("./model/user")
const userroute=require("./routes/userroute")
app.use(express.json());
app.use(express.urlencoded({extended:true}))
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/inotebook", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }); 
}
app.use(
  session({
    secret: "my super duber secret key for express",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/inotebook",
      ttl: 14 * 24 * 60 * 60,
    }),
  })
);
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    User.authenticate()
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use("/user",userroute)
app.use("/",noteroute)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})