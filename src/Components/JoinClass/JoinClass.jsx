import React, { useState } from "react";
import axios from "axios";
import "./JoinClass.css";

const JoinClass = () => {
    const [classCode, setClassCode] = useState("");

    const handleJoinClass = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8080/class/join",
                { classCode },
                { withCredentials: true } 
            );
            setClassCode("");
        } catch (error) {
            console.log(error)
            console.log(error.response?.data?.error || "Failed to join class.");
        }
    };

    return (
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
    );
};

export default JoinClass;
