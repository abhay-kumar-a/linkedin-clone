import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { FiUsers, FiUserPlus, FiSearch } from 'react-icons/fi';
import './Network.css';

export default function Network() {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [connRes, usersRes] = await Promise.all([
        userAPI.getFriends(),
        userAPI.getAllUsers()
      ]);
      setConnections(connRes.data);
      setSuggestions(usersRes.data.filter(u => u.id !== user?.id).slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (userId) => {
    toast.success('Connection request sent!');
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="container network-page">
        <div className="network-header">
          <h1>My Network</h1>
          <p>Manage your connections and grow your network</p>
        </div>

        <div className="network-search">
          <FiSearch />
          <input
            type="text"
            placeholder="Search for people"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="network-sections">
          <div className="connections-section">
            <h2>Connections ({connections.length})</h2>
            <div className="connections-grid">
              {connections.map((conn) => (
                <Link to={`/profile/${conn.id}`} key={conn.id} className="connection-card card">
                  <div className="connection-avatar">
                    {conn.firstName?.charAt(0)}{conn.lastName?.charAt(0)}
                  </div>
                  <div className="connection-info">
                    <h4>{conn.firstName} {conn.lastName}</h4>
                    <p>{conn.headline || 'LinkedIn User'}</p>
                  </div>
                </Link>
              ))}
              {connections.length === 0 && (
                <div className="empty-state">
                  <FiUsers />
                  <p>No connections yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="suggestions-section">
            <h2>People you may know</h2>
            <div className="suggestions-list">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="suggestion-card card">
                  <div className="suggestion-header">
                    <div className="suggestion-avatar">
                      {suggestion.firstName?.charAt(0)}{suggestion.lastName?.charAt(0)}
                    </div>
                    <div className="suggestion-info">
                      <h4>{suggestion.firstName} {suggestion.lastName}</h4>
                      <p>{suggestion.headline || 'LinkedIn User'}</p>
                    </div>
                  </div>
                  <button className="btn btn-outline" onClick={() => handleConnect(suggestion.id)}>
                    <FiUserPlus /> Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
