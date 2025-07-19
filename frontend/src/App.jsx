import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import MentorDashboard from './pages/MentorDashboard';
import InternDashboard from './pages/InternDashboard';

function App() {
  const { user, logout } = useContext(AuthContext);

  const Home = () => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    switch (user.role) {
      case 'Admin':
        return <AdminDashboard />; 
      case 'Mentor':
        return <MentorDashboard />;
      case 'Intern':
        return <InternDashboard />;
      default:
        logout(); 
        return <Navigate to="/login" />;
    }
  };
  
  return (
     <> 
      {user && (
          <header className="app-header">
              <span>Logged in as: <strong>{user.role}</strong></span>
              <button onClick={logout}>Logout</button>
          </header>
      )}
      <main className="main-content">
          <Routes>
              <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Home />} />
          </Routes>
      </main>
    </>
  );
}
export default App;