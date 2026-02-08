import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { server } from '../../main'; 
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './adminresults.css';

const AdminResults = ({ user }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // state สำหรับเก็บค่าค้นหา
  const resultsPerPage = 10;

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (user.role !== "admin") {
      toast.error("Access denied, admin only");
      return;
    }
    fetchResults();
  }, [user, navigate]);

  const fetchResults = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found, please log in again");
      return;
    }

    try {
      const response = await axios.get(`${server}/api/admin/results`, {
        headers: { token },
      });
      setResults(response.data.quizResults);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Failed to fetch results. " + (error.response ? error.response.data.message : ''));
    }
  };

  // ฟังก์ชันกรองข้อมูลตามค่าที่ค้นหา
  const filteredResults = results.filter((result) =>
    result.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.quizTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);

  const nextPage = () => {
    if (currentPage * resultsPerPage < filteredResults.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="results-container">
      <h2>Quiz Results</h2>
      <input
        type="text"
        placeholder="Search by User or Quiz Title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <table className="results-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Quiz Title</th>
            <th>Score</th>
            <th>Total Questions</th>
            <th>Date Taken</th>
          </tr>
        </thead>
        <tbody>
          {currentResults.length ? currentResults.map((quizResult, index) => (
            <tr key={index}>
              <td>{quizResult.userName}</td>
              <td>{quizResult.quizTitle}</td>
              <td>{quizResult.score}</td>
              <td>{quizResult.totalQuestions}</td>
              <td>{new Date(quizResult.dateTaken).toLocaleDateString()}</td>
            </tr>
          )) : (
            <tr><td colSpan="5">No results found.</td></tr>
          )}
        </tbody>
      </table>
      <div className="pagination-buttons">
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={nextPage} disabled={currentPage * resultsPerPage >= filteredResults.length}>Next</button>
      </div>
    </div>
  );
};

export default AdminResults;
