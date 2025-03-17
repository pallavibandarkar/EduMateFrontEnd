import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" ,username:""});
  const navigate = useNavigate();

  const toggleForm = () => setIsLogin(!isLogin);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
      let result;
      if (isLogin) {
        result = await axios.post("http://localhost:8080/profile/login", {
          username: formData.username,
          password: formData.password,
        },{withCredentials:true});
        toast.success("Login successful! Welcome Back!!",{
          autoClose:2000
        })
      } else {
        result = await axios.post("http://localhost:8080/profile/signup", {
          username: formData.username,
          password: formData.password,
          email: formData.email,
        }, {
          headers: { "Content-Type": "application/json" },withCredentials:true
        });
        toast.success("Signup successful!",{autoClose:2000})
      }
  
      console.log(result.data);
      setFormData({ username: "", password: "", email: "" });
      setTimeout(()=>{
        navigate("/EduMate")
      },3000)
  
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="auth-box">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="username"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          {isLogin?<></>:
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />}

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleForm}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
