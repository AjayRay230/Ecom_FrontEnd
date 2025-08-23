import axios from "axios";
import MyContext from "../Context/MyContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const RemoveUser = () => {
  const { user } = useContext(MyContext); 
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

useEffect(() => {
  if (!user) {
    setLoading(false);
    return;
  }

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    console.log("token user :" ,token);
    try {
      const res = await axios.get(
        `https://ecom-backend-rt2i.onrender.com/user/${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(res.data);
    } catch (err) {
      toast.error("Error fetching your account details");
    } finally {
      setLoading(false);
    }
  };
  fetchUser();
}, [user]);



  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    console.log("Deleting the account");
    try {
      const res = await axios.delete(`https://ecom-backend-rt2i.onrender.com/api/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
       console.log("Delete response:", res.data);
      toast.success(res.data);


      
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.warn("User not found");
      } else if (err.response && err.response.status === 403) {
        toast.warn("You are not authorized to delete this account");
      } else {
        toast.error("Error deleting account");
      }
    }
  };


  if (loading)
    return (
      <p className="loading-text">
        Loading... <FaSpinner className="spinner-icons" />
      </p>
    );

  if (!userData) return <p>No account details found.</p>;

  return (
    <div className="RemoveUser-container">
      <h2 className="remove-header">My Account</h2>
      <ul>
        <li>
          {userData.firstName} {userData.lastName} ({userData.email})
          <button
            onClick={handleDeleteAccount}
            className="removeUser-btn"
          >
            Delete My Account
          </button>
        </li>
      </ul>
    </div>
  );
};

export default RemoveUser;
