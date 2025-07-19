import React from 'react';
import InternManagement from '../components/admin/InternManagement';
import MentorManagement from '../components/admin/MentorManagement'; // <-- Import

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! From here you can manage all users and track progress.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '2rem' }}>
        <InternManagement />
        <MentorManagement />
      </div>
    </div>
  );
}
export default AdminDashboard;