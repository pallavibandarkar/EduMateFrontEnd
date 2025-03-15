import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Classroom.css";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";

export default function Classroom({isSidebarVisible}) {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([]);

  const fetchClasses =async ()=>{
    try {
      const result = await axios.get("http://localhost:8080/class/getClasses", {
        withCredentials: true,
      });
      console.log(result.data)
      setClasses(result.data.classes);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  }

  useEffect(()=>{
    fetchClasses();
  },[])
    
  return (
  
    <div className="dashboard">    
        <Sidebar isSidebarVisible={isSidebarVisible}/>
        <div className="allClasses class-container">
        {classes.length > 0 ? (
          classes.map((classItem) => (
            <div key={classItem._id} className="class-card ">
              <h3>{classItem.className}</h3>
              <p><strong>Class Code:</strong> {classItem.classCode}</p>
              <p><strong>Division:</strong> {classItem.div}</p>
              <p><strong>Instructor:</strong> {classItem.classTeacher.email}</p>
              <p><strong>Students:</strong> {classItem.students.length}</p>
              <button className="view-btn" onClick={()=> navigate(`/viewClass/${classItem._id}`)}>View Class</button>
            </div>
          ))
        ) : (
          <div className="no-classes">
            <p>No classes found.</p>
            <button className="join-btn">Join a Class</button>
            <button className="create-btn">Create a Class</button>
          </div>
        )}
        </div>
        
    </div>
    
  );
}
