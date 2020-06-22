import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "morgan";

import routes from "./src/routes";
import database from "./src/database/database";

import passport from "./src/middleware/auth";

// express setup
const app = express();
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// db connection
database.connect();

// routes
app.get("/", (req, res) => {
  res.send("Welcome, shopping-cart app - R & Co. Developers");
});
app.use("/user", routes.user);
app.use("/auth", routes.auth);
app.use("/product", passport.authenticate('jwt', {session: false}), routes.product);

// server
app.listen(process.env.PORT || 3001, () => {
  console.log(`App is listening on port ${process.env.PORT || 3001}!`);
});
