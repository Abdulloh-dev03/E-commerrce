import { Router } from "express";
import { createCategory, deleteCategory, getAllCategory,  updateCategory } from "../controllers/category.controller";
import { AdminRoute } from "../middleware/auth.middleware";


const router:Router = Router();

router.get("/", getAllCategory);
router.post("/", AdminRoute, createCategory);
router.put("/:id", AdminRoute, updateCategory);
router.delete("/:id", AdminRoute, deleteCategory);




export default router;