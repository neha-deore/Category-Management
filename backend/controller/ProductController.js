import categoryModel from "../models/categorySchema.js";
import subCategoryModel from "../models/subCategorySchema.js";
import productModel from "../models/productSchema.js";

export const getAllCategories = async (req, res) => {
  try {
    const category = await categoryModel.find().populate("subCategory");

    res.status(202).json({
      succes: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllSubCategories = async (req, res) => {
  try {
    const subcategory = await subCategoryModel.find();
    res.status(202).json({
      succes: true,
      subcategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    await categoryModel.create({
      categoryName,
    });

    const category = await categoryModel.find();

    res.status(201).json({
      succes: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const subCategory = async (req, res) => {
  try {
    const subdata = await subCategoryModel.create({
      name: req.body.name,
      category: req.body.categoryId,
    });

    const catego = await categoryModel.findById(req.body.categoryId);
    catego.subCategory.push(subdata._id);

    await catego.save();

    const cat = await categoryModel.find().populate("subCategory");
    console.log(cat);

    res.status(202).json({
      success: true,
      cat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    const subcate = await subCategoryModel.findOneAndDelete({
      _id: req.body.categoryId,
    });
    const cat = await categoryModel.findOneAndUpdate(
      { _id: subcate.category },
      { $pullAll: { subCategory: [req.body.categoryId] } }
    );
    console.log(cat);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const cat = await categoryModel.findById(req.body.categoryId);

    const sub = await subCategoryModel.deleteMany({
      _id: cat.subCategory,
    });
    cat.remove();
    res.status(201).json({
      succes: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendImages = async (req, res) => {
  const imagePaths = new Array();
  for (const file of req.files) {
    imagePaths.push(file.filename);
  }
  console.log(req.files);
  try {
    const productImage = await productModel.create({
      
      product_image: imagePaths,
      product_name: req.body.product_name,
      product_desc: req.body.product_desc,
      product_cost: req.body.product_cost,
      subCategory: req.body.subCategoryId,
    });

    const subcatego = await subCategoryModel.findById(req.body.subCategoryId);
    subcatego.products.push(productImage._id);
    subcatego.save();

    const prodDetails = await subCategoryModel.find().populate("products");

    res.status(202).json({
      success: true,
      prodDetails,
    });

  } catch (error) {
    console.log("catch block", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
