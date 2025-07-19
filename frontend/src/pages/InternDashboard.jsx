import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosConfig';
import SubmitWorkModal from '../components/intern/SubmitWorkModal'; // We will create this next

function InternDashboard() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/projects');
      setProjects(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
      setSelectedProject(null);
      setIsModalOpen(false);
  };

  const handleSuccess = () => {
      handleCloseModal();
      fetchProjects(); // Refresh the project list on success
  }

  return (
    <div>
      <h1>Intern Dashboard</h1>
      <p>Welcome! Here are your assigned projects.</p>
      <hr />

      {isModalOpen && selectedProject && (
        <SubmitWorkModal
            project={selectedProject}
            onClose={handleCloseModal}
            onSuccess={handleSuccess}
        />
      )}

      {isLoading && <p>Loading projects...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!isLoading && !error && (
        <div className="project-list-container">
          {projects.length === 0 ? (
            <p>You have no projects assigned to you yet.</p>
          ) : (
            projects.map(proj => (
              <div key={proj._id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '5px' }}>
                <h3>{proj.title}</h3>
                <p><strong>Mentor:</strong> {proj.mentor?.name || 'N/A'}</p>
                <p><strong>Status:</strong> <span style={{ fontWeight: 'bold' }}>{proj.status}</span></p>
                <p>{proj.description}</p>
                <button 
                  onClick={() => handleOpenModal(proj)} 
                  disabled={proj.status === 'Submitted' || proj.status === 'Completed'}
                >
                  {proj.status === 'Submitted' ? 'Work Submitted' : 'Submit Work'}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default InternDashboard;