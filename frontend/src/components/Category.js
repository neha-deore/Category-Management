import React, { useState, useEffect } from "react";
import Navbaar from "./Navbaar";
import { Modal, Button } from "react-bootstrap";
import { IoCloseCircle } from "react-icons/io5";
import {
  addnewCategory,
  getAllCategories,
  subCategory,
  deteleSubCat,
  deteleCat,
  getAllSubCategories,
  sendImages,
} from "../config/MyServices";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";

const regForName = RegExp(/^[a-zA-Z]/);

export default function Category() {
  const [ShowCategoryModal, setShowCategoryModal] = useState(false);
  const [ShowSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [ShowProductModal, setShowProductModal] = useState(false);
  const [state, setState] = useState({
    categoryName: "",
    subcategoryName: "",
    catId: "",
    subCatId:"",
    productImage: [],
    product_name: "",
    product_desc: "",
    product_cost: "",
  });
  const [categoriesDisplay, setcategoriesDisplay] = useState([]);
  const [subcategoriesDisplay, setSubcategoriesDisplay] = useState([]);
  const [imageDisplay, setImageDisplay] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    await getAllCategories().then((res) => {
      setcategoriesDisplay(res.data.category);
    });
  };

  const getSubCategories = async () => {
    await getAllSubCategories().then((res) => {
      setSubcategoriesDisplay(res.data.subcategory);
    });
  };

  const addCategory = async () => {
    if (state.categoryName !== "" && regForName.test(state.categoryName)) {
      let formData = {
        categoryName: state.categoryName,
      };
      await addnewCategory(formData).then((res) => {
        setcategoriesDisplay(res.data.category);
        console.log(res.data.category);
      });
      setState({ categoryName: "" });
      alert("Category Added Successfuly");
    } else {
      alert("invalid category name");
    }
    setShowCategoryModal(false);
  };

  const subcategorySet = (id, data = categoriesDisplay) => {
    console.log("subcategory");
    setState({ ...state, catId: id });
    const sub = data.filter((ele) => ele._id === id);
    setSubcategoriesDisplay(sub[0].subCategory);
    console.log(sub[0].subCategory);
    console.log(sub);
  };

  const addSubCategories = async () => {
    if (state.subcategoryName !== "") {
      if (state.catId !== "") {
        let formData = {
          name: state.subcategoryName,
          categoryId: state.catId,
        };
        await subCategory(formData).then((res) => {
          console.log(res.data);
          setcategoriesDisplay(res.data.cat);
          subcategorySet(state.catId, res.data.cat);
        });
      } else {
        alert("please select category");
      }
      setState({ ...state, subcategoryName: "" });
      setShowSubCategoryModal(false);
    }
  };

  const deleteSubCategories = async (id) => {
    let formData = {
      categoryId: id,
    };
    await deteleSubCat(formData);
    alert("Subcategory Deleted");
    // getSubCategories()
  };

  const deleteCategories = async (ele) => {
    let formData = {
      categoryId: ele,
    };
    await deteleCat(formData);
    alert("Category deleted");
    getCategories();
  };

  const imageSet = (id, data = subcategoriesDisplay) => {
    setState({ ...state, subCatId: id });
    const sub = data.filter((ele) => ele._id === id);
    setImageDisplay(sub[0].products);
  };

  const addImages = async () => {
    if (state.productImage !== "") {
      if (state.subCatId !== "") {
        console.log(document.getElementById("product").files);
        console.log(state.subCatId);
        let formData = new FormData();
        for (
          let i = 0;
          i < document.getElementById("product").files.length;
          i++
        ) {
          formData.append("file", document.getElementById("product").files[i]);
        }
        formData.append("subCategoryId", state.subCatId);
        formData.append("product_name", state.product_name);
        formData.append("product_cost", state.product_cost);
        formData.append("product_desc", state.product_desc);

        await sendImages(formData).then((res) => {
          console.log(res.data.prodDetails, "line 148");
          setImageDisplay(res.data.prodDetails);
          imageSet(state.subCatId, res.data.prodDetails);
        });
      } else {
        alert("please select Subcategory");
      }
      setState({ ...state, productImage: "", product_name:"", product_cost:"", product_desc:"" });
      setShowProductModal(false)
    }
  };

  const handleCloseModal = () => setShowCategoryModal(false);
  const handleCloseSubModal = () => setShowSubCategoryModal(false);
  const handleCloseProductModal = () => setShowProductModal(false);


  return (
    <>
      <Navbaar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-3">

        <div className="mt-3">

          <Accordion className="mt-3 shadowCus" defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="dropdown font-weight-bold">Category</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {categoriesDisplay &&
                categoriesDisplay.map((cat) => (
                  <Typography key={cat._id}>
                    <input
                      type="radio"
                      id={cat._id}
                      name="categories"
                      value={cat._id}
                      onClick={() => subcategorySet(cat._id)}
                    />
                    &nbsp; {cat.categoryName}
                    &nbsp;{" "}
                    <DeleteIcon onClick={() => deleteCategories(cat._id)} />
                  </Typography>
                ))}

            <button
            className="btn btn-dark mt-3"
            onClick={() => {
              setShowCategoryModal(true);
            }}
          >
            Add New Category
          </button>
            </AccordionDetails>
          </Accordion>
        </div>

        {/* subcategory name */}
        <Accordion className="mt-3 shadowCus" defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className="dropdown font-weight-bold">Sub Category</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {subcategoriesDisplay.length > 0 ? (
              subcategoriesDisplay.map((cat) => (
                <Typography key={cat._id}>
                  <input
                    type="radio"
                    value={cat._id}
                    name="subcategories"
                    onClick={() => imageSet(cat._id)}
                  />
                  &nbsp; {cat.name}
                  &nbsp;{" "}
                  <DeleteIcon onClick={() => deleteSubCategories(cat._id)} />
                </Typography>
              ))
            ) : (
              <Typography>No SubCategory</Typography>
            )}

            <button
            className="btn btn-dark mt-3"
            onClick={() => {
              setShowSubCategoryModal(true);
            }}
          >
            Add New Sub-Category
          </button>
          </AccordionDetails>
        </Accordion>

       {/* Add new product button */}
        <button
        className="btn btn-dark mt-3"
        onClick={() => {
        setShowProductModal(true);
        }}>
        Add Products
      </button>
        </div>
        {console.log(imageDisplay, "line 259")}
        <div className="col-9 mt-5">
        {imageDisplay.map((cat)=> 
          <>
          <p>Product name:{cat.product_name}</p>
          <p>Product description:{cat.product_desc}</p>
          </>
         
        )}
        </div>

        </div>
          {/* for categories */}
        <Modal show={ShowCategoryModal} onHide={handleCloseModal}>
          <Modal.Header>
            <Modal.Title>Add Category</Modal.Title>
            <IoCloseCircle
              onClick={handleCloseModal}
              className="close"
              style={{ width: "5rem", height: "4rem" }}
            />
          </Modal.Header>
          <Modal.Body>
            Category name :{" "}
            <input
              type="text"
              className="form-control"
              name="categoryName"
              value={state.categoryName}
              onChange={(event) =>
                setState({ ...state, categoryName: event.target.value })
              }
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => addCategory()}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        {/* for subcategories */}
        <Modal show={ShowSubCategoryModal} onHide={handleCloseSubModal}>
          <Modal.Header>
            <Modal.Title>Add Sub-Category</Modal.Title>
            <IoCloseCircle
              onClick={handleCloseSubModal}
              className="close"
              style={{ width: "5rem", height: "4rem" }}
            />
          </Modal.Header>
          <Modal.Body>
            Sub-Category name :{" "}
            <input
              type="text"
              className="form-control"
              name="subcategoryName"
              value={state.subcategoryName}
              onChange={(event) =>
                setState({ ...state, subcategoryName: event.target.value })
              }
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => addSubCategories()}>
            Add Sub Category
            </Button>
          </Modal.Footer>
        </Modal>

        {/* for product */}
        <Modal show={ShowProductModal} onHide={handleCloseProductModal}>
          <Modal.Header>
            <Modal.Title>Add Products</Modal.Title>
            <IoCloseCircle
              onClick={handleCloseProductModal}
              className="close"
              style={{ width: "5rem", height: "4rem" }}
            />
          </Modal.Header>
          <Modal.Body>
            Product name:{" "}
            <input
              type="text"
              className="form-control"
              name="product_name"
              value={state.product_name}
              onChange={(event) =>
                setState({ ...state, product_name: event.target.value })
              }
            />
            Product Cost:{" "}
            <input
              type="number"
              className="form-control"
              name="product_cost"
              value={state.product_cost}
              onChange={(event) =>
                setState({ ...state, product_cost: event.target.value })
              }
            />
            Product Description:{" "}
            <input
              type="text"
              className="form-control"
              name="product_desc"
              value={state.product_desc}
              onChange={(event) =>
                setState({ ...state, product_desc: event.target.value })
              }
            />
            Product image:{" "}
            <input
              type="file"
              id="product"
              name="product"
              multiple
              onChange={(event) =>
                setState({ ...state, productImage: event.target.files })
              }
              className="form-control"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => addImages()}>
              Add Products
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
