import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import Companies from './pages/Companies';
import Chat from './pages/Chat';
import PostDetail from './pages/PostDetail';
import CompanyDetail from './pages/CompanyDetail';
import JobDetail from './pages/JobDetail';
import Network from './pages/Network';
import Loading from './components/Loading';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (user) return <Navigate to="/" />;
  
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute><Register /></PublicRoute>
      } />
      <Route path="/" element={
        <ProtectedRoute><Home /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />
      <Route path="/profile/:id" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />
      <Route path="/jobs" element={
        <ProtectedRoute><Jobs /></ProtectedRoute>
      } />
      <Route path="/jobs/:id" element={
        <ProtectedRoute><JobDetail /></ProtectedRoute>
      } />
      <Route path="/companies" element={
        <ProtectedRoute><Companies /></ProtectedRoute>
      } />
      <Route path="/companies/:id" element={
        <ProtectedRoute><CompanyDetail /></ProtectedRoute>
      } />
      <Route path="/network" element={
        <ProtectedRoute><Network /></ProtectedRoute>
      } />
      <Route path="/chat" element={
        <ProtectedRoute><Chat /></ProtectedRoute>
      } />
      <Route path="/post/:id" element={
        <ProtectedRoute><PostDetail /></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
