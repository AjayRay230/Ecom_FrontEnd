import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaSearch, FaShoppingCart, FaMoon, FaSun, FaSignInAlt, FaCog, FaUser } from 'react-icons/fa';
import MyContext from "../Context/MyContext";
import { useNavigate } from "react-router-dom";

function NavBar({ onSelectedCategory, onSearch }) {
    const getInitialTheme = () => localStorage.getItem("theme") || "light";

    const [selectedCategory, setSelectedCategory] = useState("");
    const [input, setInput] = useState("");
    const { isLoggedIn, role, user, logout } = useContext(MyContext);
    const [theme, setTheme] = useState(getInitialTheme);
    const [searchResults, setSearchResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const handleChange = async (value) => {
        setInput(value);
        if (value.length >= 1) {
            setShowSearchResults(true);
            try {
                const response = await axios.get(
                    `https://ecom-backend-rt2i.onrender.com/product/search?keyword=${value}`
                );
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

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && input.trim() !== "") {
            navigate(`/search?keyword=${encodeURIComponent(input.trim())}`);
            setShowSearchResults(false);
        }
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        onSelectedCategory(category);
    };

    const categories = ["Laptop", "Headphones", "Mobile", "Electronics", "Toys", "Fashion"];

    return (
        <nav className='nav'>
            <header className='header'>
                <div className='navbar'>
                    <a className='logo' href="/">Shopping.in Website</a>
                    <a href="/">Home</a>

                    {isLoggedIn && role === "ADMIN" && (
                        <>
                            <a href="/add_product">Add Product</a>
                            <a href="/product/update/:id">Update Product</a>
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
                        </>
                    )}

                    <div className="dropdown-categories">
                        <button 
                            className="dropbtn-categories"
                            onClick={() => setOpen(!open)}
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

                    <a href="/Cart" className="cart"><FaShoppingCart /> Cart</a>

                    {isLoggedIn ? (
                        <div className="user-menu">
                            <button 
                                onClick={() => setShowUserMenu(!showUserMenu)} 
                                className="user-btn"
                            >
                                <FaUser className="user-icon" />
                                <span className="user-name">
                                    {user?.firstName ? `Hello, ${user.lastName} ${user.firstName}` : "Hello, Guest"}
                                </span>
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
                            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                            onKeyDown={handleKeyDown}
                        />

                        {showSearchResults && (
                            <ul className="list-group">
                                {searchResults.length > 0 ? (
                                    searchResults.map((result) => (
                                        <li
                                            key={result.id}
                                            className="list-group-item"
                                            onMouseDown={() => navigate(`/product/${result.id}`)}
                                        >
                                            <span>{result.name}</span>
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
