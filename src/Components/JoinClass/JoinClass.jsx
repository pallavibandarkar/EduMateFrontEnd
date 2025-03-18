import React, { useState } from "react";
import axios from "axios";
import "./JoinClass.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JoinClass = () => {
    const [classCode, setClassCode] = useState("");
    const navigate = useNavigate()
    const handleJoinClass = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8080/class/join",
                { classCode },
                { withCredentials: true } 
            );
            toast.success("Successfully joined the class!");
            setClassCode("");
            setTimeout(()=>{
                navigate("/EduMate")
            },3000)
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.error || "Failed to join class.");
            console.log(error.response?.data?.error || "Failed to join class.");
        }
    };

    return (
        <>
        <div className="container">
            <h2>Join a Class</h2>
            <form onSubmit={handleJoinClass} className="form">
                <input
                    type="text"
                    placeholder="Enter Class Code"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    required
                    className="input"
                />
                <button type="submit" className="button">Join Class</button>
            </form>
        </div>
         <ToastContainer position="top-right" autoClose={3000} />
         </>
    );
};

export default JoinClass;
