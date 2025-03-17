import React, { useState } from "react";
import axios from "axios";
import "./CreateClass.css";  
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateClass = () => {
//   const [className, setClassName] = useState("");
//   const [div, setDiv] = useState("");
const navigate = useNavigate()
const [data,setData] = useState({
    className : "",
    div : ""
})

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:8080/class/create",{
        className:data.className,
        div: data.div
      },{withCredentials:true})
      console.log(result)
      toast.success("Class created successfully!");
      setData({
        className:"",
        div:"",
      })
      navigate("/EduMate",1500)
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create class.");
      navigate("/EduMate")
    }
  };

  return (
    <div className="container">
      <h2>Create a New Class</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Class Name"
          value={data.className}
          name="className"
          onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
          required
          className="input"
        />
        <input
          type="text"
          placeholder="Division (Optional)"
          value={data.div}
          name="div"
          onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
          className="input"
        />
        <button type="submit" className="button">Create Class</button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateClass;
