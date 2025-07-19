import React, { useState } from 'react';
import AddProjectModal from './AddProjectModal'; 

function ProjectList({ projects, assignedInterns, onProjectCreated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h3>Your Assigned Projects</h3>
      <button onClick={() => setIsModalOpen(true)}>+ Assign New Project</button>

      {isModalOpen && (
        <AddProjectModal
          interns={assignedInterns}
          onClose={() => setIsModalOpen(false)}
          onProjectCreated={onProjectCreated}
        />
      )}

      <table border="1" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Project Title</th>
            <th>Assigned Intern</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
                <td colSpan="4">You have not assigned any projects yet.</td>
            </tr>
          ) : (
            projects.map(proj => (
              <tr key={proj._id}>
                <td>{proj.title}</td>
                <td>{proj.intern?.name || 'N/A'}</td>
                <td>{proj.status}</td>
                <td>
                  <button>Track Prog</button>
                  <button>Give Feedback</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectList;