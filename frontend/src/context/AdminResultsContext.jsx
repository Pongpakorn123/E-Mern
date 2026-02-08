import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../../main'; // เชื่อมต่อกับ server ของคุณ

const AdminResultsContext = createContext();

export const AdminResultsProvider = ({ children }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get(`${server}/api/admin/results`, {
          headers: { token },
        });
        setResults(response.data.quizResults);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, []);

  return (
    <AdminResultsContext.Provider value={{ results }}>
      {children}
    </AdminResultsContext.Provider>
  );
};

export const useAdminResultsContext = () => {
  return useContext(AdminResultsContext);
};
