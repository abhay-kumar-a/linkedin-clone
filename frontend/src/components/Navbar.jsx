import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiUser, FiBriefcase, FiMessageSquare, FiUsers, FiBell, FiSearch, FiLogOut } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
    { path: '/jobs', icon: FiBriefcase, label: 'Jobs' },
    { path: '/network', icon: FiUsers, label: 'Network' },
    { path: '/chat', icon: FiMessageSquare, label: 'Chat' },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-logo">
          <span>in</span>
        </Link>

        <div className="navbar-search">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>

        <div className="navbar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon className="nav-icon" />
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="nav-item" onClick={handleLogout}>
            <FiLogOut className="nav-icon" />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
