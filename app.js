import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import userModel from "./models/user.js";

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", (req, res) => {
  const { username, email, password, age } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
        username,
        email,
        password: hash,
        age,
      });
      console.log(createdUser);
    });
  });

  //creating jwt token and save it to the cookies or the browser through cookies
  let token = jwt.sign({ email }, "randomsecretkey");
  res.cookie("token", token);
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) {
    bcrypt.compare(req.body.password, user.password, (error, result) => {
      // here we are using bcrypt to compare the requested password with the hashed password if the user is there
      if (result) {
        //now because the password is correct and the result is true so we can set the jwt token to the browser as cookies so we dont have to make the user login again and again for some requests

        let token = jwt.sign({ email: user.email }, "somerandomsecretkey");
        res.cookie("token", token);
        console.log(result);
        res.send("your password is correct");
      } else {
        res.send("something is wrong ...something kya password hi galat hai");
      }
    });
  } else {
    res.send("something went wrong");
  }
});

app.listen(3000);
