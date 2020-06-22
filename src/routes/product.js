import { Router } from "express";

import productController from "../controllers/productController";

const router = Router();

// read
router.get("/", productController.all);
router.get("/:id", productController.read);

// create
router.post("/", productController.create);

// delete
router.delete("/:productId", productController.delete);

export default router;
