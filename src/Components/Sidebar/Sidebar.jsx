import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCircleUser, faCalendar, faGraduationCap, faGear } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ isSidebarVisible }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:8080/profile/getUser", { withCredentials: true });
                setUser(response.data.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className={`sidebar ${isSidebarVisible ? 'visible' : ''}`}>
            <div className="firstSec">
                <div className="sidebar-link">
                    <FontAwesomeIcon icon={faHouse} />
                    <p>Home</p>
                </div>
                <div className="sidebar-link">
                    <FontAwesomeIcon icon={faCalendar} />
                    <p>Calendar</p>
                </div>        
            </div>
            <hr />

            {user?.classTeacher?.length > 0 && (
                <>
                    <div className="teaching">
                        <div className="sidebar-link">
                            <FontAwesomeIcon icon={faCircleUser} />
                            <p>Teaching</p>
                        </div>
                        <ul>
                            {user.classTeacher.map((classItem, index) => (
                                <li key={index} className="sidebar-subitem">{classItem.className}</li>
                            ))}
                        </ul>
                    </div>
                    <hr />
                </>
            )}

            {user?.enrolledIn?.length > 0 && (
                <>
                    <div className="enrolled">
                        <div className="sidebar-link">
                            <FontAwesomeIcon icon={faGraduationCap} />
                            <p>Enrolled</p>
                        </div>
                        <ul>
                            {user.enrolledIn.map((classItem, index) => (
                                <li key={index} className="sidebar-subitem">{classItem.className}</li>
                            ))}
                        </ul>
                    </div>
                    <hr />
                </>
            )}

            <div className="settings">
                <div className="sidebar-link">
                    <FontAwesomeIcon icon={faGear} />
                    <p>Settings</p>
                </div>
            </div>
        </div>   
    );
}
