import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    available: false,
    quantity: "",
    imageUrl: "",
  });

  const [image, setImage] = useState(null);

  // Fetch product details 
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://ecom-backend-rt2i.onrender.com/api/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUpdateProduct(response.data);
        setImage(response.data.imageUrl); // show existing image
      } catch (error) {
        console.error("Error while fetching the product", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      let imageUrl = updateProduct.imageUrl;

      // If user selected a new image, upload it
      if (image && image instanceof File) {
        const formData = new FormData();
        formData.append("file", image);
        const uploadRes = await axios.post(
          "https://ecom-backend-rt2i.onrender.com/api/product/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        imageUrl = uploadRes.data; // uploaded image URL
      }

      // Final product update
      const updated = { ...updateProduct, imageUrl };
      await axios.put(`https://ecom-backend-rt2i.onrender.com/api/product/${id}`, updated, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Product updated successfully!");
      navigate(`/product/${id}`); // redirect back to product page
    } catch (error) {
      console.error("Error while updating product", error);
      alert("Failed to update product. Please try again");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => setImage(e.target.files[0]);

  return (
    <div className="master-container">
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Update Product</h2>

          <div className="name-div">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={updateProduct.name || ""}
              onChange={handleChange}
              placeholder="Product name"
            />
          </div>

          <div className="brand-div">
            <label>Brand</label>
            <input
              type="text"
              name="brand"
              value={updateProduct.brand || ""}
              onChange={handleChange}
              placeholder="Brand"
            />
          </div>

          <div className="description-div">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={updateProduct.description || ""}
              onChange={handleChange}
              placeholder="Description"
            />
          </div>

          <div className="price-div">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={updateProduct.price || ""}
              onChange={handleChange}
              placeholder="Eg: 1000"
            />
          </div>

          <div className="category-div">
            <label>Category</label>
            <select
              name="category"
              value={updateProduct.category || ""}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Laptop">Laptop</option>
              <option value="Cloths">Cloths</option>
              <option value="Toys">Toys</option>
              <option value="Electronics">Electronics</option>
              <option value="Headphones">Headphones</option>
              <option value="Mobile">Mobile</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>

          <div className="stock-div">
            <label>Stock Quantity</label>
            <input
              type="number"
              name="quantity"
              value={updateProduct.quantity || ""}
              onChange={handleChange}
              placeholder="Product Quantity"
            />
          </div>

          <div className="release-div">
            <label>Release Date</label>
            <input
              type="date"
              name="releaseDate"
              value={
                updateProduct.releaseDate
                  ? updateProduct.releaseDate.split("T")[0]
                  : ""
              }
              onChange={handleChange}
            />
          </div>

          <div className="image-div">
            <label>Product Image</label>
            {image ? (
              <img
                src={
                  image instanceof File
                    ? URL.createObjectURL(image)
                    : image
                }
                alt="Product"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            ) : (
              <p>No Image Available</p>
            )}
            <input type="file" onChange={handleImageChange} />
          </div>

          <div className="check-div">
            <label>
              <input
                type="checkbox"
                name="available"
                checked={updateProduct.available || false}
                onChange={handleChange}
              />
              Product Available
            </label>
          </div>

          <div className="submit-div">
            <button type="submit" className="submit-btn">
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
