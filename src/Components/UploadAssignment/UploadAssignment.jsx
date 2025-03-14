import React, { useState } from "react";
import axios from "axios";
import "./UploadAssignment.css";

const UploadAssignment = () => {
    let id = "67cefb58d876e3b30b33e92c";
    const [assignment, setAssignment] = useState({
        title: "",
        description: "",
        deadline: "",
    });
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setAssignment({ ...assignment, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", assignment.title);
        formData.append("description", assignment.description);
        formData.append("deadline", assignment.deadline);
        formData.append("file", file);

        try {
            const response = await axios.post(`http://localhost:8080/class/upload/${id}`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(response)
            setAssignment({ title: "", description: "", deadline: "", classId: "" });
            setFile(null);
        } catch (error) {
            console.log(error.response?.data?.error || "Failed to upload assignment.");
        }

    };

    return (
        <div className="upload-container">
            <h2>Upload Assignment</h2>
            <form onSubmit={handleSubmit} className="upload-form">
                <input type="text" name="title" placeholder="Title" value={assignment.title} onChange={handleChange} required className="input" />
                <textarea name="description" placeholder="Description" value={assignment.description} onChange={handleChange} required className="textarea" />
                <input type="date" name="deadline" value={assignment.deadline} onChange={handleChange} required className="input" />
                <input type="file" name="file" onChange={handleFileChange} required  className="file-input" />
                <button type="submit" className="button">Upload</button>
            </form>

        </div>
    );
};

export default UploadAssignment;
