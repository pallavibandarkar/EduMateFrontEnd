import React, { useState, useEffect } from "react";
import "./GradingReport.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const GradingReport = () => {
    let { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const gradingData = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/class/getGrading/${id}`, { withCredentials: true });
            setData(result.data?.data || {});
        } catch (err) {
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        gradingData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!data) return <p>No grading data found.</p>;

    // Function to split text at ".," and create separate list items
    const splitText = (textArray) => {
        return textArray?.flatMap(text => text.split(".,").map(item => item.trim())).filter(item => item);
    };

    return (
        <div className="grading-container">
            <h2>Grading Report</h2>
            <div className="grade-score">
                <h3>Score: {data.score}/100</h3>
            </div>
            <div className="remarks">
                <h3>Remarks:</h3>
                <ul>
                    {splitText(data.remarks)?.map((remark, index) => (
                        <li key={index}>{remark}</li>
                    ))}
                </ul>
            </div>
            <div className="suggestions">
                <h3>Suggestions:</h3>
                <ul>
                    {splitText(data.suggestions)?.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                    ))}
                </ul>
            </div>
            <div className="errors">
                <h3>Errors:</h3>
                <ul>
                    {splitText(data.errors)?.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GradingReport;
