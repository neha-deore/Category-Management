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
    const cat = await categoryModel.updateOne(
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
   await subcatego.save();
   
  const prodDetails = await subCategoryModel.findById(req.body.subCategoryId).populate("products");
console.log(prodDetails)
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

export const deleteProduct=async (req,res) =>{
  console.log(req.body.product_id,"line 158")
  try {
  
    const productdetails = await productModel.findOneAndDelete({
      _id:req.body.product_id,
    });
    console.log(productdetails.subCategory,"line164")
    
    const subcatedelete=await subCategoryModel.findOneAndUpdate(
      {_id:productdetails.subCategory},
      {$pullAll:{products:[req.body.product_id]}}
    );

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    
  }
}

export const  getAllProduct =async(req,res)=>{
  const {_id}=req.body
  try {
    
    const prodDetails = await subCategoryModel.findById(_id).populate("products")
    
    res.status(202).json({
      success: true,
      prodDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const updateproducts = async(req,res)=>{
  try {
    console.log(req.body, "line 200")
    const prod = await productModel.findById(req.body.id)

    const {product_name, product_cost, product_desc} = req.body

    if(product_name){
      prod.product_name = product_name
    }

    if(product_cost){
      prod.product_cost = product_cost
    }

    if(product_desc){
      prod.product_desc = product_desc
    }

    await prod.save();

    res.status(200).json({success: true, message:"Product Updated"})
  } 
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}