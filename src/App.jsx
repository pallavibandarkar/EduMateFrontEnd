import React from "react"
import {Routes,Route} from "react-router-dom"
import HomePage from "./Components/HomePage/HomePage"
import LoginSignup from "./Components/LoginSignup/LoginSignup"
import CreateClass from "./Components/CreateClass/CreateClass"
import JoinClass from "./Components/JoinClass/JoinClass"
import UploadAssignment from "./Components/UploadAssignment/UploadAssignment"
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/login" element={<LoginSignup/>}/>
        <Route path="/creteClass" element={<CreateClass/>} />
        <Route path="/joinClass" element={<JoinClass/>} />
        <Route path="/uploadAssignment" element={<UploadAssignment/>}/>
      </Routes>
    </div>
  )
}

export default App
