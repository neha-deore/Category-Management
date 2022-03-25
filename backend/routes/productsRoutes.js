import express from 'express';
import { addCategory, subCategory, getAllCategories,deleteSubCategory, deleteCategory, getAllSubCategories,sendImages } from '../controller/ProductController.js';
import {upload} from "../middleware/multer.js"
const router = express.Router();

router.post("/addCategory", addCategory)
router.post("/subCategory", subCategory)
router.get("/getAllCategories", getAllCategories)
router.get("/getAllSubCategories",getAllSubCategories)
router.post("/deleteSubCategory", deleteSubCategory)
router.post("/deleteCategory", deleteCategory)
// router.route("/sendImages").post(upload.array("product",4),sendImages)
router.post("/sendImages",upload.array("file"),sendImages);

export default router

