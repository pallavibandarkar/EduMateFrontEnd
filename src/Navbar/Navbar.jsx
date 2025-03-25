import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"
import { assets } from "../assets/assets.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars,faUser,faPlus, faP} from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ user,logOutUser,toggleSidebar }){
    
    const navigate = useNavigate()
   
    return(
        <div className="nav">
            <div className="logo-name" onClick={()=>navigate("/EduMate")}>
                <FontAwesomeIcon icon={faBars} className="menu" onClick={toggleSidebar}/>
                <img src={assets.EdumateLogo} className="edumateLogo"/>
                <h4 className="logoName">EduMate</h4>
            </div>
            <div className="profile">
                {user?
                <>
                <p onClick={()=>navigate("/EduMate/joinClass")}>Join</p>
                <FontAwesomeIcon icon={faPlus} className="profileIcons" onClick={()=>navigate("/EduMate/createClass")}/>
                <FontAwesomeIcon icon={faUser} className="profileIcons"/>
                <button className="btns" onClick={logOutUser}>Logout</button>
                </>:
                <button className="btns" onClick={()=>navigate('/EduMate/login')}>Login</button>
                }
                
                
            </div>
            
        </div>
    )
}