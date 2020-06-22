import { Router } from "express";

import userController from "../controllers/userController";
import passport from "../middleware/auth";

const router = Router();

// cart operations
router.get("/cart", passport.authenticate('jwt', {session: false}), userController.getCart);
router.post("/cart/:action/:productId", passport.authenticate('jwt', {session: false}), userController.setCart);

// read
router.get("/:email", passport.authenticate('jwt', {session: false}), userController.read);

// create
router.post("/", userController.create);


export default router;
