import { FaTimes } from "react-icons/fa";

const CheckOutPop = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
    if (!show) return null;

    return (
        <div className="checkout-popup">
            <div className="checkout-header">
                <h2>Checkout</h2>
                <button className="close-btn" onClick={handleClose}>
                    <FaTimes />
                </button>
            </div>

            <div className="checkout-items">
                {cartItems.map((item) => (
                    <div key={item.id} className="checkout-item">
                        <img src={item.imageUrl} alt={item.name} />
                        <div className="item-details">
                            <strong>{item.name}</strong>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
                <h4 className="checkout-total">Total: ${totalPrice.toFixed(2)}</h4>
            </div>

            <div className="checkout-actions">
                <button className="cancel-btn" onClick={handleClose}>Close</button>
                <button className="confirm-btn" onClick={handleCheckout}>Confirm Purchase</button>
            </div>
        </div>
    );
};

export default CheckOutPop;
