import axios from "axios";
import MyContext from "../Context/MyContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
const UserList = ()=>{
    const {role} = useContext(MyContext);
    const[users,setUsers] = useState([]);
    const[loading,setLoading] = useState(true);
    const fetchUserList = async()=>{
            try{
                const response  = await axios.get(`https://ecom-backend-rt2i.onrender.com/api/user/AllUsers`,{
                    headers:{
                        "Authorization":`Bearer ${localStorage.getItem("token")}`
                    }
                });
                setUsers(response.data);

            }
            catch(err)
            {
                toast.error("Error while getting the User list",err);
            }
            finally{
                setLoading(false);
            }
    }
    useEffect(()=>
    {
        fetchUserList()
    },[]);
    if(loading) <p className="loading-text"> Loading... <FaSpinner className="spinner-icons"/></p>
    return (
        <div className="userlist-container">
            <h2 className="userlist-header">Users</h2>
             <table className="userlist-table">
                <thead>
                <tr>
                    <th>User ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Role</th>
                </tr>
                </thead>
                <tbody>
                    {users.map((u)=>(
                        <tr key = {u.userId}>
                            <td>{u.userId}</td>
                            <td>{u.firstName}</td>
                            <td>{u.lastName}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </div>
    )
}
export default UserList;