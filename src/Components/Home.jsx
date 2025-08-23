import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import MyContext from "../Context/MyContext";
import { Link } from "react-router-dom";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, refreshData, AddToCart } = useContext(MyContext);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [products, setProducts] = useState([]);
  const hasFetchedData = useRef(false);

  // Fetch main product data
 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!hasFetchedData && token){ 
    hasFetchedData = true;
    refreshData(); // Wait until token exists
  }

}, [refreshData]);


  // Fetch product images
 // Fetch main product data when token is available


// Fetch product images after data is loaded
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token || !Array.isArray(data) || data.length === 0) return;

  const fetchImageAndUpdateProducts = async () => {
    console.log("product token ->", token);
    const updatedProducts = await Promise.all(
      data.map(async (product) => {
        try {
          const response = await axios.get(
            `https://ecom-backend-rt2i.onrender.com/api/product/${product.id}/image`,
            {
              responseType: "blob",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const imageUrl = URL.createObjectURL(response.data);
          return { ...product, imageUrl };
        } catch (error) {
          console.log(
            "Error while fetching the image for product ID :",
            product.id,
            error
          );
          return { ...product, imageUrl: "placeholder-image-url" };
        }
      })
    );
    setProducts(updatedProducts);
  };

  fetchImageAndUpdateProducts();
}, [data]);


  // Filter products by category if selected
  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : products;

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        <img
          src={unplugged}
          alt="Error"
          style={{ width: "100px", height: "100px" }}
        />
      </h2>
    );
  }

  return (
    <>
     {isError ? (
      <div className="error-container">
        <img src={unplugged} alt="Error" />
        <p>Something went wrong. Please try again later.</p>
      </div>):(
      <div className="grid">
        {filteredProducts.length === 0 ? (
          <h2>No Products Available</h2>
        ) : (
          filteredProducts.map((product) => {
            const { id, brand, name, price, available, imageUrl } = product;
            return (
              <div className="card" key={id}>
                <Link to={`/product/${id}`} style={{}}>
                  <div className="card-body" style={{}}>
                    <img
                      src={imageUrl}
                      alt={name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        padding: "5px",
                        margin: "0",
                        borderRadius: "10px 10px 10px 10px",
                      }}
                    />
                    <div>
                      <h5 className="card-name">{name.toUpperCase()}</h5>
                      <span className="card-brand">
                        By : <i className="brand-tag">{brand}</i>
                      </span>
                    </div>
                    <div>
                      <h5 className="card-text">{"$" + price}</h5>
                      <button
                        className="btn btn-primery"
                        onClick={(e) => {
                          e.preventDefault();
                          AddToCart(product);
                        }}
                        disabled={!available}
                      >
                        {available ? "Add to cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        )}
        
      </div>
)}
    </>
  );
};

export default Home;
