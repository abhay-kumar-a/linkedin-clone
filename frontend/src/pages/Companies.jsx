import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { FiMapPin, FiGlobe, FiUsers, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Companies.css';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    website: '',
    size: '1-10'
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await companyAPI.getAllCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await companyAPI.createCompany(formData);
      toast.success('Company created!');
      setShowCreateModal(false);
      fetchCompanies();
    } catch (error) {
      toast.error('Error creating company');
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="container companies-page">
        <div className="companies-header">
          <h1>Companies</h1>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <FiPlus /> Create Company
          </button>
        </div>

        <div className="companies-grid">
          {companies.map((company) => (
            <Link to={`/companies/${company.id}`} key={company.id} className="company-card card">
              <div className="company-cover"></div>
              <div className="company-logo">
                {company.name?.charAt(0)}
              </div>
              <div className="company-info">
                <h3>{company.name}</h3>
                <p>{company.industry || 'Industry'}</p>
                <div className="company-meta">
                  <span><FiMapPin /> {company.location || 'Location'}</span>
                  <span><FiUsers /> {company.size || '1-10'} employees</span>
                </div>
              </div>
            </Link>
          ))}
          {companies.length === 0 && (
            <div className="empty-state">
              <p>No companies yet. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create Company</h2>
              <button onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="input-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="input-group">
                  <label>Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>Size</label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                  >
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
