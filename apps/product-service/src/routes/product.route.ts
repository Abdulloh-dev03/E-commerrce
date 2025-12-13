import { Router } from "express";
import { createProduct, deleteProduct, getAllProduct, getProduct, updateProduct } from "../controllers/product.controller";
import { AdminRoute } from "../middleware/auth.middleware";

const router:Router = Router();

router.get("/",getAllProduct);
router.get("/:id",getProduct);
router.post("/",AdminRoute, createProduct);
router.put("/:id",AdminRoute, updateProduct);
router.delete("/:id",AdminRoute, deleteProduct);




export default router;