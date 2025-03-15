import React from "react";
import "./Sidebar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse,faCircleUser,faCalendar,faGraduationCap,faGear } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({isSidebarVisible}){
    return(
        <div className={`sidebar ${isSidebarVisible ? 'visible' : ''}`}>
            <div className="firstSec">
                <div className="sidebar-link">
                    <FontAwesomeIcon icon={faHouse} />
                    <p>Home</p>
                </div >
                <div className="sidebar-link">
                    <FontAwesomeIcon icon={faCalendar} />
                    <p>Calender</p>
                </div>        
            </div>
            <hr/>

            <div className="teaching">
                <div className="sidebar-link">
                    <FontAwesomeIcon icon={faCircleUser} />
                    <p>Teaching</p>
                </div>
            </div>
            <hr/>
            <div className="enrolled">
                <div className="sidebar-link">
                    <FontAwesomeIcon icon={faGraduationCap} />
                    <p>Enrolled</p>
                </div>
            </div>
            <hr/>
            <div className="settings">
                <div className="sidebar-link">
                    <FontAwesomeIcon icon={faGear} />
                    <p>Settings</p>
                </div>
            </div>
        </div>   
    )
}