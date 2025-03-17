import React,{useState} from "react"
import {Routes,Route} from "react-router-dom"
import HomePage from "./Components/HomePage/HomePage"
import LoginSignup from "./Components/LoginSignup/LoginSignup"
import CreateClass from "./Components/CreateClass/CreateClass"
import JoinClass from "./Components/JoinClass/JoinClass"
import UploadAssignment from "./Components/UploadAssignment/UploadAssignment"
import Classroom from "./Components/Classroom/Classroom"
import Navbar from "./Navbar/Navbar"
import ViewClass from "./Components/ViewClass/ViewClass"
function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
     setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar}/>
      <Routes>
        <Route path="/EduMate" element={<Classroom isSidebarVisible={isSidebarVisible}/>}/>
        <Route path="/EduMate/login" element={<LoginSignup/>}/>
        <Route path="/EduMate/createClass" element={<CreateClass/>}/>
        <Route path="/EduMate/joinClass" element={<JoinClass/>}/>
        <Route path="/EduMate/viewClass/:id" element={<ViewClass/>} />
      </Routes>
    </div>
  )
}

export default App
