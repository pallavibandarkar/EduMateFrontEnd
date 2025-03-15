import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ViewClass.css";

const ViewClass = () => {
    const { id } = useParams();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState({});
    const [uploading, setUploading] = useState({});

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/class/getClass/${id}`);
                setClassData(response.data.class);
            } catch (err) {
                setError("Failed to fetch class details.");
            } finally {
                setLoading(false);
            }
        };
        fetchClassDetails();
    }, [id]);

    const handleFileChange = (e, assignmentId) => {
        setSelectedFiles({ ...selectedFiles, [assignmentId]: e.target.files[0] });
    };

    const handleFileUpload = async (assignmentId) => {
        if (!selectedFiles[assignmentId]) return alert("Please select a file!");

        const formData = new FormData();
        formData.append("file", selectedFiles[assignmentId]);
        setUploading({ ...uploading, [assignmentId]: true });
        try {
            const response = await axios.post(`http://localhost:8080/class/grade-submission/${assignmentId}`, formData, {withCredentials:true},{
                headers: { "Content-Type": "multipart/form-data" ,}
            });
            console.log(response)
        } catch (err) {
            alert("Failed to submit assignment.");
        } finally {
            setUploading({ ...uploading, [assignmentId]: false });
            setSelectedFiles({ ...selectedFiles, [assignmentId]: null });
        }
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="class-container">
            <div className="header">
                <h2>{classData.className}</h2>
                <p className="class-code">Class Code: <span>{classData.classCode}</span></p>
            </div>

            <div className="card teacher">
                <h3>Class Teacher</h3>
                <p>{classData.classTeacher.username}</p>
                <p className="email">{classData.classTeacher.email}</p>
            </div>

            <div className="card">
                <h3>Assignments</h3>
                {classData.assignments.length > 0 ? (
                    <div className="grid">
                        {classData.assignments.map((assignment) => (
                            <div className="assignment-card" key={assignment._id}>
                                <h4>{assignment.title}</h4>
                                <p>{assignment.description}</p>
                                <a href={assignment.file.url} target="_blank" rel="noopener noreferrer">📎 View File</a>
                                <p className="deadline">⏳ {new Date(assignment.deadline).toLocaleDateString()}</p>

                                {/* Submission Section */}
                                <div className="upload-section">
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, assignment._id)}
                                    />
                                    <button 
                                        onClick={() => handleFileUpload(assignment._id)} 
                                        disabled={uploading[assignment._id]}
                                    >
                                        {uploading[assignment._id] ? "Uploading..." : "Submit"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty">No assignments uploaded.</p>
                )}
            </div>
        </div>
    );
};

export default ViewClass;
