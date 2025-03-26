import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewClass.css";
import { toast, ToastContainer } from "react-toastify";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser  } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ViewClass = ({user}) => {
    const navigate = useNavigate()
    const { id } = useParams();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState({});
    const [uploading, setUploading] = useState({});
    const [assignmentDetails, setAssignmentDetails] = useState({ title: "", description: "", deadline: "", file: null });
    const [submissionData, setSubmissionData] = useState([]);
    const [activeTab, setActiveTab] = useState("assignments");
    const [announcementContent, setAnnouncementContent] = useState("");
    const [submissionStats, setSubmissionStats] = useState({});
    const [updatedScores, setUpdatedScores] = useState({});

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/class/getClass/${id}`,{withCredentials:true});
                console.log(response.data.class)
                setClassData(response.data.class);
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

    const handleAnnouncementChange = (e) => {
        setAnnouncementContent(e.target.value);
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
            setAssignmentDetails({ title: "", description: "", deadline: "", file: null })
            toast.success("Assignment uploaded successfully!");
        } catch (err) {
            console.log(err)
            toast.error("Failed to upload assignment.");
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === "review") {
            fetchSubmissionData();
            const submissionStats = getSubmissionStats();
        }

    };

    const handleAnnouncementSubmit = async () => {
        if (!announcementContent) {
            return alert("Please enter announcement content!");
        }

        try {
            const response = await axios.post(`http://localhost:8080/announcement/${classData._id}`, { content: announcementContent }, { withCredentials: true });
            toast.success("Announcement created successfully!");
            setAnnouncementContent("");
            await getAnnouncement()
        } catch (err) {
            toast.error("Failed to create announcement.");
        }
    };

    const getAnnouncement = async()=>{
        try {
            const response = await axios.get(`http://localhost:8080/announcement/${classData._id}`, { withCredentials: true });
            setClassData(prevData => ({ ...prevData, announcements: response.data.data })); 
        } catch (err) {
            console.error("Error fetching announcements:", err);
            toast.error("Failed to fetch announcements.");
        }
    }

    const fetchSubmissionData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/class/submissions/${classData._id}`, { withCredentials: true });
            //console.log("Submissions:"+JSON.stringify(response, null, 2))
            setSubmissionData(response.data.submissions);
        } catch (err) {
            toast.error("Failed to fetch submission data.");
        }
        
    };
    

    
    const getSubmissionStats = () => {
    if (!classData || !classData.assignments) return {};

    const stats = {};
    classData.assignments.forEach(assignment => {
        stats[assignment._id] = {
            title: assignment.title,
            beforeDeadline: 0,
            afterDeadline: 0,
            totalSubmissions: 0,
        };
    });
    submissionData.forEach(submission => {
        const assignmentId = submission.assignmentId._id; 
        const submissionDate = new Date(submission.submittedOn);
        const deadline = new Date(submission.assignmentId.deadline); 

        if (stats[assignmentId]) {
            stats[assignmentId].totalSubmissions += 1;
            if (submissionDate <= deadline) {
                stats[assignmentId].beforeDeadline += 1;
            } else {
                stats[assignmentId].afterDeadline += 1;
            }
        } else {
            console.warn(`No stats found for Assignment ID: ${assignmentId}`);
        }
    });
    return stats;
};
    useEffect(() => {
        if (activeTab === "review") {
            fetchSubmissionData().then(() => {
                const stats = getSubmissionStats();
                
                setSubmissionStats(stats);
            });
        }
    }, [activeTab,submissionData]);

    const barData = {
        labels: Object.values(submissionStats).map(stat => stat.title),
        datasets: [
            {
                label: 'Submitted Before Deadline',
                data: Object.values(submissionStats).map(stat => stat.beforeDeadline),
                backgroundColor: '#28A745',
            },
            {
                label: 'Submitted After Deadline',
                data: Object.values(submissionStats).map(stat => stat.afterDeadline),
                backgroundColor: '#DC3545', 
            },
        ],
    };

    const handleScoreChange = (submissionId, newScore) => {
        setUpdatedScores((prevScores) => ({
            ...prevScores,
            [submissionId]: newScore,
        }));
    };

    const handleUpdateScore = async (submissionId) => {
        const updatedScore = updatedScores[submissionId];
        if (updatedScore === undefined) {
            return alert("Please enter a new score.");
        }
        console.log(updatedScores[submissionId])
        try {
            const response = await axios.put(`http://localhost:8080/class/updateScore/${submissionId}`, { score: updatedScore }, { withCredentials: true });
            toast.success("Score updated successfully!");
            fetchSubmissionData(); 
        } catch (err) {
            console.log(err)
            toast.error("Failed to update score.");
        }
    };
    

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;
    

    return (
        <div className="class-container1">
            <div className="navigationBar">
                <p onClick={() => handleTabChange("assignments")} className={activeTab === "assignments" ? "active" : ""}>Assignments</p>
                <p onClick={() => handleTabChange("announcements")} className={activeTab === "announcements" ? "active" : ""}>Announcements</p>
                <p onClick={() => handleTabChange("students")} className={activeTab === "students" ? "active" : ""}>People</p>
                <p onClick={()=> handleTabChange("review")}className={activeTab === "review" ? "active" : ""}>To Review</p>
            </div>
            <div className="header">
                <h2>{classData.className}</h2>
                <p>{classData.div}</p>
            </div>
            
            {user && classData.classTeacher && user.toString() === classData.classTeacher._id.toString() && activeTab === "assignments" && (
                <div className="tassignment-card">
                <h3 className="tassignment-title">Upload Assignment</h3>
                <input type="text" name="title" placeholder="Title" className="tassignment-input" value={assignmentDetails.title} onChange={handleAssignmentChange} />
                <textarea name="description" placeholder="Description" className="tassignment-textarea" value={assignmentDetails.description} onChange={handleAssignmentChange}></textarea>
                <input type="date" name="deadline" className="tassignment-input" value={assignmentDetails.deadline} onChange={handleAssignmentChange} />
                <input type="file" className="tassignment-file" onChange={handleAssignmentFileChange} />
                <button className="tassignment-button" onClick={handleAssignmentUpload}>Upload</button>
              </div>
            )}
            

            {activeTab === "assignments" && (
                <div className="card">
                <h3 className="text">Assignments</h3>
                {classData.assignments.length > 0 ? (
                    <div className="grid">
                        {classData.assignments.map((assignment) => {
                        const submission = assignment.submissions.find(sub => sub.studentId === user);
                        const hasSubmitted = assignment.submissions.some(submission => submission.studentId === user);
                        const isStudent = classData.students.some(student => student._id === user);
                        
                        return (
                            <div className="assignment-card" key={assignment._id}>
                                <h4>{assignment.title}</h4>
                                <p>{assignment.description}</p>
                                <a href={assignment.file.url} target="_blank" rel="noopener noreferrer">View File</a>
                                <p className="deadline">Deadline: {new Date(assignment.deadline).toLocaleDateString()}</p>
                            
                                {isStudent && !hasSubmitted && (
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
                                )}

                                {isStudent && hasSubmitted &&(
                                    <button onClick={()=>navigate(`/grading/${submission._id}`)}>View Gradings</button>
                                )}


                            </div>
                           );
                        })}
                    </div>
                ) : (
                    <p className="empty">No assignments uploaded for the class</p>
                )}
                </div>
            )}

            {activeTab === "announcements" && (
                <div className="announcement-form">
                    {user && classData.classTeacher && user.toString() === classData.classTeacher._id.toString() && (
                    <div>
                        <h3>Create Announcement</h3>
                        <textarea value={announcementContent} onChange={handleAnnouncementChange} placeholder="Enter announcement content" />
                        <button onClick={handleAnnouncementSubmit}>Submit</button>
                    </div>
                    )}
                    <h3>Announcements</h3>
                    <div className="announcement-list">
                        {classData.announcements && classData.announcements.length > 0 ? (
                        <ul> 
                            {classData.announcements.map((announcement) => (
                            <li key={announcement._id}>
                                <p>{announcement.content}</p>
                                <p className="date">{new Date(announcement.createdAt).toLocaleDateString()}</p>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p className="empty">No announcements available.</p>
                    )}
                </div>
            </div>
            )}

            {activeTab === "students" && (
                <div className="card">
                    <h3 className="text">Teachers</h3>
                    <p><FontAwesomeIcon icon={faCircleUser } style={{marginRight:"10px"}}/>
                       {classData.classTeacher.username}
                    </p>
                    <h3 className="text">Students</h3>
                    {classData.students.length > 0 ? (
                        <ul>
                            {classData.students.map((student) => (
                                <li key={student._id} style={{listStyle:"none"}}>
                                    <p><FontAwesomeIcon icon={faCircleUser } style={{marginRight:"10px"}}/>{student.username}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="empty">No students enrolled in this class.</p>
                    )}
                </div>
            )}

            {activeTab === "review" && (
                <div className="review-dashboard">
                    <h3>Submission Analytics Dashboard</h3>
                    <Bar data={barData} options={{ responsive: true }} />
                    <div>
                    <table>
                <thead className="SubmissionTable">
                    <tr>
                        <th>Student</th>
                        <th>Assignment Name</th>
                        <th>Submission</th>
                        <th>Assignment File</th>
                        <th>Assignment Solution</th>
                        <th>Score</th>
                        <th>Update Score</th>
                    </tr>
                </thead>
                <tbody className="SubmissionData">
                    {submissionData.map((submission, index) => (
                        <tr key={submission._id}>
                            <td>{submission.studentId.username}</td>
                            <td>{submission.assignmentId.title}</td>
                            <td>{new Date(submission.submittedOn )<= new Date(submission.assignmentId.deadline)?"Before Deadline":"After Deadline"}</td>
                            <td>
                                <a href={submission.assignmentId.file.url} target="_blank" rel="noopener noreferrer">
                                    View Assignment
                                </a>
                            </td>
                            <td>
                                <a href={submission.file.url} target="_blank" rel="noopener noreferrer">
                                    View Solution
                                </a>
                            </td>
                            <td>
                                <p>{submission.aiGrade.score}</p>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    placeholder="New Score"
                                    onChange={(e) => handleScoreChange(submission._id, e.target.value)}
                                />
                                <button onClick={() => handleUpdateScore(submission._id)}>Update</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
                    </div>
                </div>
                 
            )}
            
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ViewClass;
