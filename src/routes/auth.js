import { Router } from "express";

import authController from "../controllers/authController";

const router = Router();

// create
router.post("/login", authController.login);

export default router;
