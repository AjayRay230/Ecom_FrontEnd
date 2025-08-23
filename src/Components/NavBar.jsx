import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaSearch, FaShoppingCart, FaMoon, FaSun, FaSignInAlt, FaCog,FaUser } from 'react-icons/fa';
import MyContext from "../Context/MyContext";

function NavBar({ onSelectedCategory, onSearch }) {
    const getInitialTheme = () => {
        const storedTheme = localStorage.getItem("theme");
        return storedTheme ? storedTheme : "light";
    };

    const [selectedCategory, setSelectedCategory] = useState("");
    const [input, setInput] = useState("");
    const { isLoggedIn, role, user, logout } = useContext(MyContext);
    const [theme, setTheme] = useState(getInitialTheme);
    const [searchResults, setSearchResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
     const[showUserMenu,setShowUserMenu] = useState(false); 
     const[open,setOpen] = useState(false);  
    // console.log("user details :" ,user);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`https://ecom-backend-rt2i.onrender.com/api/product`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleChange = async (value) => {
        const token = localStorage.getItem("token");
        setInput(value);
        if (value.length >= 1) {
            setShowSearchResults(true);
            try {
                const response = await axios.get(`https://ecom-backend-rt2i.onrender.com/api/product/search?keyword=${value}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                setSearchResults(response.data);
                setNoResults(response.data.length === 0);
            } catch (error) {
                console.error("Error searching:", error);
            }
        } else {
            setShowSearchResults(false);
            setSearchResults([]);
            setNoResults(false);
        }
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        onSelectedCategory(category);
    };

    const categories = ["Laptop", "Headphones", "Mobile", "Electronics", "Toys", "Fashion"];

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
        <nav className='nav'>
            <header className='header'>
                <div className='navbar'>
                    <a className='logo' href="https://github.com/">Shopping.in Website </a>
                    <a href="/">Home</a>

                    {/* Only show Add Product if Admin */}
                    {isLoggedIn && role === "ADMIN" && (
                        <a href="/add_product">Add Product</a>
                    )}
                    {
                        isLoggedIn && role === "ADMIN" &&(
                            <a href = "/product/update/:id">Update Product</a>
                        )
                    }
                                    {isLoggedIn && role === "ADMIN" && (
                                <div className="dropdown-admin">
                                    <button className="dropbtn-admin">
                                    Admin Panel
                                    <span style={{ fontSize: '0.7rem', marginLeft: '8px' }}> ▼ </span>
                                    </button>
                                    <div className="dropdown-content-admin">
                                    <a href="/admin/userlist">User List</a>
                                    <a href="/admin/adduser">Add User</a>
                                    <a href="/admin/removeuser">Remove User</a>
                                    </div>
                                </div>
                                )}
                    <div className="dropdown-categories">
                        <button 
                        className="dropbtn-categories"
                        onClick={()=>setOpen(!open)}
                        >
                            Categories
                            <span style={{ fontSize: '0.7rem', marginLeft: '10px' }}> ▼ </span>
                        </button>
                        <div className="dropdown-content-categories">
                            <ul>
                            {categories.map((category) => (
                                <li key={category}>
                                    <button onClick={() => handleCategorySelect(category)}>
                                        {category}
                                    </button>
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>

                    <button onClick={toggleTheme} className="toggle-btn">
                        {theme === 'light' ? <FaSun /> : <FaMoon />}
                    </button>

                    <a href="/Cart" className="cart">
                        <FaShoppingCart /> Cart
                    </a>

                   {/* User Section */}
{isLoggedIn ? (
  <div className="user-menu">
    <button 
      onClick={() => setShowUserMenu(!showUserMenu)} 
      className="user-btn"
    >
      <FaUser className="user-icon" />
      <span className="user-name">{user && user.firstName ? `Hello, ${user.lastName} ${user.firstName}` : "Hello, Guest"}</span>
      <span className="arrow">▼</span>
    </button>

    {showUserMenu && (
      <ul className="user-dropdown">
        <li>
          <a href="/settings">
            <FaCog className="menu-icon" /> Settings
          </a>
        </li>
        <li onClick={logout}>
          <FaSignInAlt className="menu-icon" /> Logout
        </li>
      </ul>
    )}
  </div>
) : (
  <a href="/login" className="login-btn">
    <FaSignInAlt style={{ marginRight: "5px" }} /> Login
  </a>
)}

                    <div className="search-container">
                        <FaSearch className="search-icons" />
                        <input
                            type="search"
                            placeholder="Search"
                            className="search-box"
                            value={input}
                            onChange={(e) => handleChange(e.target.value)}
                            onFocus={() => setShowSearchResults(true)}
                            onBlur={() => setShowSearchResults(false)}
                        />
                        {showSearchResults && (
                            <ul className="list-group">
                                {searchResults.length > 0 ? (
                                    searchResults.map((result) => (
                                        <li key={result.id} className="list-group-item">
                                            <a href={`/product/${result.id}`} className="search-result-link">
                                                <span>{result.name}</span>
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    noResults && <p className="no-results-msg">No product with such name</p>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            </header>
        </nav>
    );
}

export default NavBar;
