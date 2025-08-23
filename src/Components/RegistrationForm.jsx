import { useState,useContext } from "react"
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import MyContext from "../Context/MyContext";
const RegistrationForm = ({OnRegister})=>{
    const[form,setForm] = useState({
        userName:"",
        password:"",
        firstName:"",
        lastName:"",
        confirmPassword :"",
        acceptTerms:false,
        role:"USER",
        email:"",

    });
    const {login} = useContext(MyContext);
    const handleChange = (e)=>{
        const{name,value} = e.target;
        setForm({...form,[name]:value});
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        if(!form.acceptTerms)
        {
            alert("Please accepts the terms and conditions ");
            return;
        }
        if(form.password!==form.confirmPassword)
        {
            toast.warn("password do not matched  please enter the same password");
            return;
        }
        const payload = {
            firstName:form.firstName,
            lastName:form.lastName,
            password:form.password,
            email:form.email,
            role:"USER",
            userName:form.userName

        }
        try{

            const res =    await axios.post(`https://ecom-backend-rt2i.onrender.com/user/register`,payload,
               
            );
            login(res.data);
            OnRegister?.();
            setForm({userName:"",password:"",firstName:"",lastName:"",role:"USER",email:"",confirmPassword:"",acceptTerms:false});
            toast.success("registration has been successful");
        }
        catch (err) {
            if (err.response?.status === 409) {
                toast.warn("Username or email already exists. Please use a different one.");
            } else {
                console.error("Registration failed", err);
                toast.warn("Registration failed. Please try again.");
            }
        }


    }
    const handleCheckBoxChange = (e)=>{
        setForm({...form,[e.target.name]:e.target.checked})
    }
    return(
        <div className="login-container">
            
            <form onSubmit={handleSubmit} className="loginForm">
                <div className="reg-header">
            <h2 >Registration Page</h2>
            </div>
                <input type = "text" onChange={handleChange} value ={form.userName} name = "userName" placeholder="User Name"/>
                <input type="text" onChange={handleChange} value={form.firstName} name = "firstName" placeholder="Enter your first Name"/>
                <input type = "text" onChange={handleChange} value  = {form.lastName} name  = "lastName" placeholder="Enter your last Name"/>
                <input type = "email" onChange={handleChange} value = {form.email} name = "email" placeholder="Enter your Email Id"/>
                <input type ="password" onChange={handleChange} value={form.password} name = "password" placeholder="Enter your password"/>
                <input type = "password" onChange={handleChange} value = {form.confirmPassword} name = "confirmPassword" placeholder="Confirm Password"/>
                {/* <select onChange={handleChange} value = {form.role} name = "role" placeholder="Enter role">
                    <option value = "USER" >USER</option>
                    <option value = "ADMIN">ADMIN</option>
                </select> */}
                <label className="termsCondition-label">
                    <input type = "checkbox"
                           name = "acceptTerms"
                           className="terms-cond-input"
                           checked= {form.acceptTerms}
                           onChange={handleCheckBoxChange}/>
                       I  accept all terms & conditions

                </label>
                <button type = "submit" >Register</button>
                <p className="login-link" >Already Have an account ?<Link to = "/login">Login</Link></p>
            </form>
        </div>
    )
}
export default RegistrationForm;