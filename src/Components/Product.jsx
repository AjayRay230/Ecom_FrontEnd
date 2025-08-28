import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import MyContext from "../Context/MyContext";

function Product() {
  const [product, setProduct] = useState(null);
  const { AddToCart, removeFromCart, refreshData } = useContext(MyContext);
  const [imageUrl, setImageUrl] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `https://ecom-backend-rt2i.onrender.com/api/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        
        setProduct(response.data);

        
        setImageUrl(response.data.imageUrl);
      } catch (error) {
        console.error("Error while fetching product:", error);
        alert("Error loading product details.");
      }
    };

    fetchProduct();
  }, [id]);

 
  const deleteProduct = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://ecom-backend-rt2i.onrender.com/api/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      removeFromCart(id);
      console.log("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.log("Error deleting product:", error);
    }
  };

 
  const handleAddToCart = () => {
    if (!product) {
      alert("Product is not loaded yet. Please wait...");
      return;
    }
    AddToCart(product);
    alert("Product has been added to the cart");
  };

  
  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  if (!product) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading.....
      </div>
    );
  }

  return (
    <div className="product-card">
      <div className="product-image">
        {imageUrl && (
          <img
            className="column-img"
            src={imageUrl}
            alt={product.name || "Product Image"}
          />
        )}
      </div>

      <div className="column">
        <div className="product-description">
          <h2>{product.category}</h2>
          <div>
            <h6>
              Listed:{" "}
              <span>
                <i>
                  {new Date(product.releaseDate).toLocaleDateString() || "N/A"}
                </i>
              </span>
            </h6>
          </div>
          <h2>{product.name}</h2>
          <h5>{product.brand}</h5>
          <p>{product.description}</p>
        </div>

        <div className="price">
          <span>$ {product.price}</span>

          <button
            className={`cart-btn ${!product.available ? "disable-btn" : ""}`}
            onClick={handleAddToCart}
            disabled={!product.available}
          >
            {product.available ? "Add to Cart" : "Out of Stock"}
          </button>

          <h5 style={{ color: "#1976d2", margin: "10px 0" }}>
            Stock Available:{" "}
            <i style={{ marginLeft: "10px", color: "#1976d2" }}>
              {product.quantity}
            </i>
          </h5>

          <div>
            <h4>Product Listed on:</h4>
            <i>{new Date(product.releaseDate).toLocaleDateString()}</i>
          </div>
        </div>

        <div className="get-btn">
          <button className="update-btn" onClick={handleEditClick}>
            Update
          </button>
          <button className="delete-btn" onClick={deleteProduct}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
