import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {useState}  from "react";
import { toast } from "react-toastify";
const AddProduct = ()=>{
const[product,setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    releaseDate: "",
    available: false,
});
const[image,setImage] = useState(null);
const handleInputChange = (e)=>
{
    const{name,value,type,checked} = e.target;
    setProduct((prev)=>({...prev,[name]:type==="checkbox"?checked:value,}));
}
const handleImageChange = (e)=>
{
    setImage(e.target.files[0]);
}
const handleSubmit = async (event) => {
  event.preventDefault();

  if (!image) {
    toast.warn("Please select an image file");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("You are not logged in");
    return;
  }

  // Convert numeric fields to proper types
  const productData = {
    ...product,
    price: Number(product.price),
    quantity: Number(product.quantity),
    available: Boolean(product.available),
  };

  // Create FormData for multipart request
  const formData = new FormData();
  formData.append("imageFile", image);
  formData.append(
    "product",
    new Blob([JSON.stringify(productData)], { type: "application/json" })
  );

  try {
    const response = await axios.post(
      "https://ecom-backend-rt2i.onrender.com/api/product/add",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Let Axios set Content-Type automatically
        },
      }
    );

    console.log("Product added successfully:", response.data);
    toast.success("Product added successfully");
    // Optionally reset form
    setProduct({
      name: "",
      brand: "",
      description: "",
      price: "",
      category: "",
      quantity: "",
      releaseDate: "",
      available: false,
    });
    setImage(null);
  } catch (error) {
    console.error("Error adding product:", error.response || error);
    if (error.response && error.response.data) {
      toast.error(`Error: ${error.response.data}`);
    } else {
      toast.error("Error adding product");
    }
  }
};


    return (
        
        <div className="master-container">
            <div className="container">
                <form className="form" onSubmit={handleSubmit}>
                    <div className="name-div">
                        <label className="label-name">
                            <h6>Name</h6>
                        </label>
                        <input
                        className="name"
                        type = "text"
                        placeholder="product name"
                        onChange={handleInputChange}
                        value={product.name}
                        name = "name"/>
                    </div>
                    <div className="brand-div">
                        <label className="label-brand">
                            <h6>Brand</h6>
                        </label>
                        <input
                        type = "text"
                        placeholder="name of brand"
                        name = "brand"
                        onChange={handleInputChange}
                        value = {product.brand}
                        />
                    </div>
                    <div className="description-div">
                        <label className="description-label">
                            <h6>Description</h6>

                        </label>
                        <input 
                        value = {product.description}
                        type = "text"
                        name = "description"
                        onChange={handleInputChange}
                        placeholder="Description of Product"
                        />
                    </div>
                    <div className="price-div">
                        <label className="price-label">
                            <h6>Price</h6>
                        </label>
                        <input type = "number"
                        value = {product.price}
                        name = "price"
                        onChange={handleInputChange}
                        placeholder="Eg:$1000"/>
                    </div>
                    <div className="category-div">
                        <label className="category-label">
                            <h6>Category</h6>

                        </label>
                        <select 
                        name = "category"
                         value = {product.category}
                         onChange={handleInputChange}
                         className="select">
                            <option value = "">Select Category</option>
                            <option value = "Laptop">Laptop</option>
                            <option value = "Cloths">Cloths</option>
                            <option value="Toys">Toys</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Headphones">Headphones</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Fashion">Fashion</option>
                         </select>
                    </div>
                    <div className="stock-div">
                        <label className="stock-label">
                            <h6>Stock Quantity</h6>

                        </label>
                        <input value = {product.quantity}
                        onChange={handleInputChange}
                        type = "number"
                        name = "quantity"
                        placeholder="Product Quantity"/>

                    </div>
                    <div className="release-div">
                        <label className="release-label">
                            <h6>Release Date</h6>
                        </label>
                        <input
                                type="date"
                                name="releaseDate"
                                value={product.releaseDate ? product.releaseDate : ""}  
                                onChange={(e) =>
                                    setProduct({
                                    ...product,
                                    releaseDate: e.target.value, 
                                    })
                                }
                                placeholder="yyyy-MM-dd"
                                />
                    </div>
                    <div className="image-div">
                        <label className="image-label">
                             <img
                                src={image ? URL.createObjectURL(image) : "/placeholder.png"}
                                alt={product.imageName}
                                style={{
                                    width: "100%",
                                    height: "180px",
                                    objectFit: "cover",
                                    padding: "5px",
                                    margin: "0",
                                }}
                                />
                        </label>
                        <input type = "file"
                        onChange={handleImageChange}
                         placeholder="upload image"
                         name = "imageUrl"
                         id = "imageUrl"
                        />
                    </div>
                    <div className="check-div">
                        <label className="availabel-label"> Product Available</label>
                        <input type = "checkbox"
                        className="checkbox"
                        name = "available"
                        checked = {product.available}
                        onChange={(e)=>{
                            setProduct({...product,available:e.target.checked})
                        }}
                        />
                        
                    </div>
                    <div className="submit-div">
                        <button className="submit-btn"
                        type="submit"
                        
                        > Submit</button>
                    </div>
                </form>
            </div>
            </div>
        
    )
 }
 export  default AddProduct