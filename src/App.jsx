import { useState } from 'react';
import './App.css';
import NavBar from "./Components/NavBar.jsx";
import AddProduct from "./Components/AddProduct.jsx";
import CART from "./Components/Cart.jsx";
import Product from "./Components/Product.jsx";
import MyContext from "./Context/MyContext";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Components/Home.jsx";
import UpdateProduct from './Components/UpdateProduct.jsx';
import LoginForm from './Components/LoginForm.jsx';
import RegistrationForm from './Components/RegistrationForm.jsx';
import RemoveUser from "./Components/RemoveUser.jsx";
import UserList from "./Components/UserList.jsx";
import AddUser from './Components/AddUser.jsx';
import SearchResults from './Components/SearchResults.jsx';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [logIn, setLogIn] = useState(false);
  const navigate = useNavigate();

  const handleSelectedCategory = (category) => {
    setSelectedCategory(category);
    toast.info("category:", category);
  };

  const handleLoginSuccess = () => {
    setLogIn(true);
    toast.info("Login Successful");
    navigate("/navigation");
  };

  const AddtoCart = (product) => {
    const currentIndex = cart.find((item) => item.id === product.id);
    if (currentIndex) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  return (
       <>
       
      <NavBar path="/navigation" onSelectedCategory={handleSelectedCategory} />
      <Routes>
        <Route
          path="/"
          element={<Home AddToCart={AddtoCart} selectedCategory={selectedCategory} />}
        />
         <Route path="/admin/userlist" element={<UserList />} />
        <Route path="/admin/adduser" element={<AddUser />} />
        <Route path="/admin/removeuser" element={<RemoveUser />} />
        <Route path = "/settings" element = {<RemoveUser/>}/>
        <Route path="/add_product" element={<AddProduct />} />
        <Route path="/product" element={<Product />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="/Cart" element={<CART />} />
        <Route path="/product/update/:id" element={<UpdateProduct />} />
        <Route path = "/search" element = {<SearchResults/>}/>
        <Route
          path="/login"
          element={
            <div className='login-page-container'>
              <h3 className='login-page-header'>Login Page </h3>
              <LoginForm onLogin={handleLoginSuccess} />
            </div>
          }
        />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
       <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
