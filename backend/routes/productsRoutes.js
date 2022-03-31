import express from 'express';
import { addCategory, subCategory, getAllCategories,deleteSubCategory, deleteCategory,sendImages,deleteProduct, getAllProduct, updateproducts } from '../controller/ProductController.js';
import {upload} from "../middleware/multer.js"
const router = express.Router();

router.post("/addCategory", addCategory)
router.post("/subCategory", subCategory)
router.get("/getAllCategories", getAllCategories)
router.post("/getAllProduct", getAllProduct)
router.post("/deleteSubCategory", deleteSubCategory)
router.post("/deleteCategory", deleteCategory)
router.post("/sendImages",upload.array("file"),sendImages);
router.post("/deleteProduct", deleteProduct)
router.post("/updateProd", updateproducts)

export default router

