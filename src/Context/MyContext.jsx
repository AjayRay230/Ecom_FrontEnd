import { useState, createContext, useEffect } from 'react';
import axios from "axios";
import { toast } from "react-toastify";

const MyContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [isError, setIsError] = useState("");
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem("cart");
        try {
            const parsed = JSON.parse(storedCart);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });

    
    const login = ({ token, userId, role, firstName, lastName, email }) => {
        if (!token) {
            toast.error("Invalid Login: No token returned");
            return;
        }

        const userData = { userId, role, firstName, lastName, email };

        // Save token and user to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Update state
        setUser(userData);
        setRole(role);
        setIsLoggedIn(true);

        toast.success("Login Successful");
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setRole(null);
        setIsLoggedIn(false);
        toast.info("Logout Successfully...");
    };

    const AddToCart = (product) => {
        const getCurrentItemIndex = cart.findIndex((item) => item.id === product.id);
        if (getCurrentItemIndex !== -1) {
            const updateCart = cart.map((item, index) =>
                index === getCurrentItemIndex
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setCart(updateCart);
            localStorage.setItem("cart", JSON.stringify(updateCart));
        } else {
            const updateCart = [...cart, { ...product, quantity: 1 }];
            setCart(updateCart);
            localStorage.setItem("cart", JSON.stringify(updateCart));
        }
    };

    const refreshData = async () => {
        try {
            const getResponse = await axios.get("https://ecom-backend-rt2i.onrender.com/api/product",{
              headers:{
                "Authorization":`Bearer ${localStorage.getItem("token")}`
              }
            });
            if(Array.isArray(getResponse.data))
            {
            setData(getResponse.data);
            }
            else {
              setData([]);
            }
        } catch (error) {
            setIsError(error.message || "Failed to fetch products");
        }
    };

    
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedToken && storedUser) {
            setIsLoggedIn(true);
            setRole(storedUser.role);
            setUser(storedUser);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const removeFromCart = (productID) => {
        const updatedCart = cart.filter((item) => item && item.id !== productID);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    return (
        <MyContext.Provider value={{
            data,
            isError,
            cart,
            AddToCart,
            removeFromCart,
            refreshData,
            login,
            logout,
            user,
            role,
            isLoggedIn,
            setIsLoggedIn
        }}>
            {children}
        </MyContext.Provider>
    );
};

export default MyContext;
