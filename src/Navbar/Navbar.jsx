import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"
import { assets } from "../assets/assets.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars,faUser,faPlus, faP} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";


export default function Navbar({ toggleSidebar }){
    const [user,setUser] = useState("")
    const navigate = useNavigate()
    const isUserExits =async ()=>{
        try {
            const result = await axios.get("http://localhost:8080/user", { withCredentials: true });
            setUser(result.data.user._id)
        } catch (error) {
            console.error("Error fetching user:", error.response?.data || error.message);
        }
    }

    const logOutUser = async()=>{
        try{
            const result = await axios.get("http://localhost:8080/profile/logout",{
                withCredentials:true,
            })
            setUser("")
            console.log(result.data)
            setTimeout(()=>{
                navigate("/")
            },2000)
        }catch(err){
            console.error("Logout error:", error.response?.data || error.message);
        }
    }

    useEffect(()=>{
        isUserExits();
    },[])

    return(
        <div className="nav">
            <div className="logo-name" onClick={()=>navigate("/")}>
                <FontAwesomeIcon icon={faBars} className="menu" onClick={toggleSidebar}/>
                <img src={assets.EdumateLogo} className="edumateLogo"/>
                <h4 className="logoName">EduMate</h4>
            </div>
            <div className="profile">
                {user?
                <>
                <p onClick={()=>navigate("/joinClass")}>Join Class</p>
                <FontAwesomeIcon icon={faPlus} className="profileIcons" onClick={()=>navigate("/createClass")}/>
                <FontAwesomeIcon icon={faUser} className="profileIcons"/>
                <button className="btns" onClick={logOutUser}>Logout</button>
                </>:
                <button className="btns" onClick={()=>navigate('/login')}>Login</button>
                }
                
                
            </div>
            
        </div>
    )
}