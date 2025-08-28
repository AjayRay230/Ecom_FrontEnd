import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyContext from "../Context/MyContext";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, refreshData, AddToCart } = useContext(MyContext);
  const [products, setProducts] = useState([]);
  const hasFetchedData = useRef(false);
  const navigate = useNavigate();

  // Fetch products 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!hasFetchedData.current && token) {
      hasFetchedData.current = true;
      refreshData();
    }
  }, [refreshData]);

  // Update state when data changes
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setProducts(data);
    }
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
        </div>
      ) : (
        <div className="grid">
          {filteredProducts.length === 0 ? (
            <h2>No Products Available</h2>
          ) : (
            filteredProducts.map((product) => {
              const { id, brand, name, price, available, imageUrl } = product;
              return (
                <div
                  className="card"
                  key={id}
                  onClick={() => navigate(`/product/${id}`)} // ✅ card click navigates
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <img
                      src={imageUrl || "https://placehold.co/300x200"}
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
                          e.stopPropagation(); 
                          AddToCart(product);
                        }}
                        disabled={!available}
                      >
                        {available ? "Add to cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
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
