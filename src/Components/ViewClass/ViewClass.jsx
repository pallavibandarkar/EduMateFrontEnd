import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewClass.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewClass = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState({});
    const [uploading, setUploading] = useState({});
    const [assignmentDetails, setAssignmentDetails] = useState({ title: "", description: "", deadline: "", file: null });

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/class/getClass/${id}`,{withCredentials:true});
                setClassData(response.data.class);
                console.log("class:"+response)
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate("/EduMate/login");
                } else {
                    setError("Failed to fetch class details.");
                    toast.error("Error fetching class details!");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchClassDetails();
    }, [id]);

    const handleAssignmentChange = (e) => {
        setAssignmentDetails({ ...assignmentDetails, [e.target.name]: e.target.value });
    };

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
            console.log(response.data)
            toast.success("Assignment submitted successfully!");
        } catch (err) {
            toast.error("Failed to submit assignment.");
        } finally {
            setUploading({ ...uploading, [assignmentId]: false });
            setSelectedFiles({ ...selectedFiles, [assignmentId]: null });
        }
    };

    const handleAssignmentFileChange = (e) => {
        setAssignmentDetails({ ...assignmentDetails, file: e.target.files[0] });
    };

    const handleAssignmentUpload = async () => {
        if (!assignmentDetails.title || !assignmentDetails.description || !assignmentDetails.deadline || !assignmentDetails.file) {
            return alert("Please fill all fields and upload a file!");
        }

        const formData = new FormData();
        formData.append("file", assignmentDetails.file);
        formData.append("title", assignmentDetails.title);
        formData.append("description", assignmentDetails.description);
        formData.append("deadline", assignmentDetails.deadline);

        try {
            const response = await axios.post(`http://localhost:8080/class/uploadAss/${id}`, formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
            console.log(response.data)
            setAssignmentDetails({ title: "", description: "", deadline: "", file: null })
            toast.success("Assignment uploaded successfully!");
        } catch (err) {
            console.log(err)
            toast.error("Failed to upload assignment.");
        }
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="class-container1">
            <div className="header">
                <h2>{classData.className}</h2>
                <p>{classData.div}</p>
            </div>

            <div className="tassignment-card">
              <h3 className="tassignment-title">Upload Assignment</h3>
              <input type="text" name="title" placeholder="Title" className="tassignment-input" value={assignmentDetails.title} onChange={handleAssignmentChange} />
              <textarea name="description" placeholder="Description" className="tassignment-textarea" value={assignmentDetails.description} onChange={handleAssignmentChange}></textarea>
              <input type="date" name="deadline" className="tassignment-input" value={assignmentDetails.deadline} onChange={handleAssignmentChange} />
              <input type="file" className="tassignment-file" onChange={handleAssignmentFileChange} />
              <button className="tassignment-button" onClick={handleAssignmentUpload}>Upload</button>
            </div>


            {/* <div className="card teacher">
                <h3>Class Teacher</h3>
                <p>{classData.classTeacher.username}</p>
                <p className="email">{classData.classTeacher.email}</p>
            </div> */}

            <div className="card">
                <h3 className="text">Assignments</h3>
                {classData.assignments.length > 0 ? (
                    <div className="grid">
                        {classData.assignments.map((assignment) => (
                            <div className="assignment-card" key={assignment._id}>
                                <h4>{assignment.title}</h4>
                                <p>{assignment.description}</p>
                                <a href={assignment.file.url} target="_blank" rel="noopener noreferrer">View File</a>
                                <p className="deadline">Deadline: {new Date(assignment.deadline).toLocaleDateString()}</p>
                                {!assignment.submissions?
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
                                </div>:<></>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty">No assignments uploaded for the class</p>
                )}
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ViewClass;
