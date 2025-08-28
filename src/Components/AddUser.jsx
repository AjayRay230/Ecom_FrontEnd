import React, { useState } from "react";

export default function AddUser() {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    role: "USER"
  });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token"); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("https://ecom-backend-rt2i.onrender.com/api/user/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.status === 201) {
        setMessage(" User added successfully!");
        setFormData({ userName: "", password: "", role: "USER" });
      } else {
        setMessage(" Failed to add user. Please try again.");
      }
    } catch (error) {
      setMessage(" Server error. Please try again later.");
    }
  };

  return (
    <div className="add-user-container">
      <h2>Add New User</h2>
      <form className="add-user-form" onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          First Name:
          <input 
          type="text"
          name = "firstName"
          value={formData.firstName}
          onChange={handleChange}
          required/>
          </label>
           <label>
             Last Name:
          <input 
          type="text"
          name = "lastName"
          value={formData.lastName}
          onChange={handleChange}
          required/>
        </label>
         <label>
          Email:
          <input 
          type="email"
          name = "email"
          value={formData.email}
          onChange={handleChange}
          required/>
          </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Role:
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>

        <button type="submit">Add User</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
