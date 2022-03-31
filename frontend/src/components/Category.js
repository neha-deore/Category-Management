import React, { useState, useEffect } from "react";
import Navbaar from "./Navbaar";
import { Modal, Button,Card } from "react-bootstrap";
import { IoCloseCircle } from "react-icons/io5";
import {
  addnewCategory,
  getAllCategories,
  subCategory,
  deteleSubCat,
  deteleCat,
  getAllProduct,
  sendImages,
  deleteProduct,
  updateprod
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
  const [ShowEditProductModal, setShowEditProductModal] = useState(false);
  const [state, setState] = useState({
    categoryName: "",
    subcategoryName: "",
    catId: "",
    subCatId:"",
    prodId:"",
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

  const addCategory = async () => {
    if (state.categoryName !== "" && regForName.test(state.categoryName)) {
      let formData = {
        categoryName: state.categoryName,
      };
      await addnewCategory(formData).then((res) => {
        setcategoriesDisplay(res.data.category);
      });
      setState({ categoryName: "" });
      alert("Category Added Successfuly");
    } else {
      alert("invalid category name");
    }
    setShowCategoryModal(false);
  };

  const subcategorySet = (id, data = categoriesDisplay) => {
    setState({ ...state, catId: id });
    const sub = data.filter((ele) => ele._id === id);
    setSubcategoriesDisplay(sub[0].subCategory);
   
  };

  const addSubCategories = async () => {
    if (state.subcategoryName !== "") {
      if (state.catId !== "") {
        let formData = {
          name: state.subcategoryName,
          categoryId: state.catId,
        };
        await subCategory(formData).then((res) => {
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

  const deleteProd = async (id) =>{
    let formData={
      product_id:id,
    };
    await  deleteProduct(formData);
    alert("Product deleted");
  };

  const deleteCategories = async (ele) => {
    let formData = {
      categoryId: ele,
    };
    await deteleCat(formData);
    alert("Category deleted");
    getCategories();
  };

  const imageSet = async(id, data = subcategoriesDisplay) => {
    setState({ ...state, subCatId: id });
    // const sub = data.filter((ele) => ele._id === id);
    // setImageDisplay(sub[0].products);
    
    await getAllProduct({_id:id}).then((res)=>{
      console.log(res.data.prodDetails.products,"line aroaba ")
      setImageDisplay(res.data.prodDetails.products);
      
    })
    

  };

  const addImages = async () => {
    if (state.productImage !== "") {
      if (state.subCatId !== "") {
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
          setImageDisplay(res.data.prodDetails.products);
          console.log(res.data.prodDetails,"line 160")
        });
      } else {
        alert("please select Subcategory");
      }
      setState({ ...state, productImage: "", product_name:"", product_cost:"", product_desc:"" });
      setShowProductModal(false)
    }
  };

  const editProd = (ele) =>{
    setShowEditProductModal(true)
    setState({...state, product_name:ele.product_name , product_cost:ele.product_cost, product_desc:ele.product_desc, prodId:ele._id})
  }

  const updateProduct = async () =>{
    let formData = {
      id:state.prodId,
      product_name:state.product_name,
      product_cost:state.product_cost,
      product_desc:state.product_desc
    };
    await updateprod(formData).then((res)=>{
      console.log(res.data)
    })
    setState({...state, product_name:"", product_cost:"", product_desc:"", prodId:""})
    setShowEditProductModal(false);
  }

  const handleCloseModal = () => setShowCategoryModal(false);
  const handleCloseSubModal = () => setShowSubCategoryModal(false);
  const handleCloseProductModal = () => setShowProductModal(false);
  const handleCloseEditProductModal = () => setShowEditProductModal(false);


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
        <div className="col-9 mt-5">
        <div className='row'>
                {imageDisplay.map((ele) =>
                    <div className='col my-3'>
                      
                    <Card style={{ width: '18rem',background:"#F5F5F5"}} >
                      
                <Card.Img variant="top" src={"./images/" + ele.product_image[0]} height="300"  />
                
                <Card.Body >
                    <Card.Title className='font-weight-bold'><span className='font-weight-bold text-danger'>Product Name:</span> {ele.product_name}</Card.Title>
                    <Card.Text>
                   <span className='font-weight-bold text-danger'>Rs.</span><b>{ele.product_cost}</b><br/>
                   <span className='font-weight-bold text-danger'>Description:</span><b>{ele.product_desc}</b>
                   </Card.Text>
                   <button className="btn btn-info mt-3" onClick={()=>editProd(ele)} >Edit</button> &nbsp;                  
                   <button className="btn btn-success mt-3" onClick={()=>deleteProd(ele._id)}>Delete</button>
                    </Card.Body>
                  </Card>
                    </div>
                      )}
                </div>

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


        {/* for edit product */}
        <Modal show={ShowEditProductModal} onHide={handleCloseEditProductModal}>
          <Modal.Header>
            <Modal.Title>Edit Product</Modal.Title>
            <IoCloseCircle
              onClick={handleCloseEditProductModal}
              className="close"
              style={{ width: "5rem", height: "4rem" }}
            />
          </Modal.Header>
          <Modal.Body>
            Product name:{" "}
            <input
              type="text"
              className="form-control"
              value={state.product_name}
              onChange={(event) =>
                setState({ ...state, product_name: event.target.value })
              }
            />
            Product Cost:{" "}
            <input
              type="number"
              className="form-control"
              value={state.product_cost}
              onChange={(event) =>
                setState({ ...state, product_cost: event.target.value })
              }
            />
            Product Description:{" "}
            <input
              type="text"
              className="form-control"
              value={state.product_desc}
              onChange={(event) =>
                setState({ ...state, product_desc: event.target.value })
              }
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => updateProduct()}>
              Edit Products
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
