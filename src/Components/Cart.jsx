import MyContext from "../Context/MyContext"
import axios from "axios";
import CheckOutPop from "./CheckOutPop";
import { useContext, useEffect, useState } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const CART = () => {
  const { cart, removeFromCart, clearCart } = useContext(MyContext);
  const [cartItems, SetCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        // Fetch backend products
        const response = await axios.get(`https://ecom-backend-rt2i.onrender.com/api/product`,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        });
        const backEndProductId = response.data.map((product) => product.id);

        const updatedCartItems = cart.filter((item) =>
          backEndProductId.includes(item.id)
        );

        // Attach images 
        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const res = await axios.get(
                `https://ecom-backend-rt2i.onrender.com/api/product/${item.id}/image`
              );
              return { ...item, imageUrl: res.data };
            } catch (error) {
              console.error("Error fetching image", error);
              return { ...item, imageUrl: "/placeholder.png" };
            }
          })
        );

        SetCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error while fetching product data", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    }
  }, [cart]);

  // Calculate total price
  useEffect(() => {
    const total = (cartItems || []).reduce((acc, item) => {
      if (!item || !item.price || !item.quantity) return acc;
      return acc + item.price * item.quantity;
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          toast.info("Cannot add more than available quantity");
        }
      }
      return item;
    });
    SetCartItems(newCartItems);
  };

  const handleDereasedQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    SetCartItems(newCartItems);
  };

  const handleremoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((items) => items.id !== itemId);
    SetCartItems(newCartItems);
  };

  const handleCheckOut = async () => {
    const token = localStorage.getItem("token");
    try {
      for (const items of cartItems) {
        const { imageUrl, quantity, ...rest } = items;
        const updatedStockQuantity = items.stockQuantity - items.quantity;
        const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };

        await axios.put(
          `https://ecom-backend-rt2i.onrender.com/api/product/${items.id}`,
          updatedProductData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      clearCart();
      SetCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.log("Error while checkout:", error);
    }
  };

  return (
    <div className="cart-container">
      <div className="shopping-cart">
        <div className="title">Shopping Bag</div>

        {cartItems.length === 0 ? (
          <div className="empty">
            <h4>Cart is Empty</h4>
          </div>
        ) : (
          <>
            {cartItems
              ?.filter((item) => item)
              .map((item) => (
                <div key={item.id} className="cart-item">
                  {/* Product Image */}
                  <img
                    src={item.imageUrl || "/placeholder.png"}
                    alt={item.name || "No name"}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />

                  {/* Brand & Name */}
                  <div className="brand-details">
                    <span>{item.brand}</span>
                    <span>{item.name}</span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="quantity">
                    <button onClick={() => handleDereasedQuantity(item.id)}>
                      <FaMinus />
                    </button>
                    <input type="text" value={item.quantity} readOnly />
                    <button onClick={() => handleIncreaseQuantity(item.id)}>
                      <FaPlus />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleremoveFromCart(item.id)}
                    className="remove-btn"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

            {/* Cart Total */}
            <div className="total">Total: ${totalPrice}</div>

            {/* Checkout Button */}
            <button className="checkout-btn" onClick={() => setShowModal(true)}>
              CheckOut
            </button>
          </>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckOutPop
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckOut}
      />
    </div>
  );
};

export default CART;
