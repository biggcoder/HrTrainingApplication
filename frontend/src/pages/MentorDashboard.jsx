import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
// We'll create the ProjectList component next
import ProjectList from '../components/mentor/ProjectList';

function MentorDashboard() {
  const [projects, setProjects] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [projectsResponse, profileResponse] = await Promise.all([
        axiosInstance.get('/projects'),
        axiosInstance.get('/users/me'),
      ]);
      setProjects(projectsResponse.data);
      setMyProfile(profileResponse.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Mentor Dashboard</h1>
      <p>Welcome, {myProfile?.name}!</p>
      <hr />
      
      {isLoading && <p>Loading your data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {!isLoading && !error && myProfile && (
        <ProjectList 
          projects={projects} 
          assignedInterns={myProfile.assignedInterns}
          onProjectCreated={fetchData} // Callback to refresh data
        />
      )}
    </div>
  );
}

export default MentorDashboard;