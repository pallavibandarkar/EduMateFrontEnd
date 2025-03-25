import React,{useState ,useEffect} from "react"
import {Routes,Route} from "react-router-dom"
import axios from "axios"
import LoginSignup from "./Components/LoginSignup/LoginSignup"
import CreateClass from "./Components/CreateClass/CreateClass"
import JoinClass from "./Components/JoinClass/JoinClass"
import UploadAssignment from "./Components/UploadAssignment/UploadAssignment"
import Classroom from "./Components/Classroom/Classroom"
import Navbar from "./Navbar/Navbar"
import ViewClass from "./Components/ViewClass/ViewClass"
import GradingReport from "./Components/GradingReport/GradingReport"
function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [user, setUser ] = useState(null); // Manage user state here

  const toggleSidebar = () => {
     setIsSidebarVisible(!isSidebarVisible);
  };

  const checkUser  = async () => {
    try {
      const result = await axios.get("http://localhost:8080/user", { withCredentials: true });
      setUser (result.data.user._id); 
    } catch (error) {
      console.error("Error fetching user:", error.response?.data || error.message);
      setUser (null);
    }
  };

  const logOutUser  = async () => {
    try {
      await axios.get("http://localhost:8080/profile/logout", { withCredentials: true });
      setUser (null);
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    checkUser ();
  }, [])

  useEffect(() => {
    console.log("User  state updated:", user); 
  }, [user]);
  return (
    <div>
      <Navbar  user={user} logOutUser ={logOutUser } toggleSidebar={toggleSidebar}/>
      <Routes>
        <Route path="/grading/:id" element={<GradingReport/>}/>
        <Route path="/EduMate" element={<Classroom isSidebarVisible={isSidebarVisible} user={user}/>}/>
        <Route path="/EduMate/login" element={<LoginSignup setUser={setUser}/>}/>
        <Route path="/EduMate/createClass" element={<CreateClass/>}/>
        <Route path="/EduMate/joinClass" element={<JoinClass/>}/>
        <Route path="/EduMate/viewClass/:id" element={<ViewClass user={user}/>} />
      </Routes>
    </div>
  )
}

export default App
