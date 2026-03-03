import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI, categoryAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { FiSearch, FiMapPin, FiBriefcase, FiClock, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Jobs.css';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'desc'
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    description: '',
    industry: '',
    website: ''
  });
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    jobType: 'FULL_TIME',
    categoryId: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchCategories();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      let response;
      if (filters.search) {
        response = await jobAPI.getAllJobs();
        setJobs(response.data.filter(job => 
          job.title.toLowerCase().includes(filters.search.toLowerCase())
        ));
      } else if (filters.category) {
        response = await jobAPI.getJobsByCategory(filters.category);
        setJobs(response.data);
      } else {
        response = await jobAPI.getJobsSorted(filters.sort);
        setJobs(response.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      await jobAPI.createJob({ ...companyForm, isCompany: true });
      toast.success('Company created!');
      setShowCreateModal(false);
    } catch (error) {
      toast.error('Error creating company');
    }
  };

  const handleApply = async (jobId) => {
    try {
      await jobAPI.applyJob({ jobId });
      toast.success('Applied successfully!');
    } catch (error) {
      toast.error('Already applied or error');
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="container jobs-page">
        <div className="jobs-header card">
          <h1>Jobs</h1>
          <div className="jobs-search">
            <div className="search-input">
              <FiSearch />
              <input
                type="text"
                placeholder="Search jobs by title"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            <div className="search-input">
              <FiMapPin />
              <input type="text" placeholder="Location" />
            </div>
            <button className="btn btn-primary">Search</button>
          </div>
          <div className="jobs-filters">
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({...filters, sort: e.target.value})}
            >
              <option value="desc">Most Recent</option>
              <option value="asc">Oldest</option>
            </select>
            <button className="btn btn-secondary">
              <FiFilter /> Filters
            </button>
          </div>
        </div>

        <div className="jobs-list">
          <h2>{jobs.length} Jobs</h2>
          {jobs.map((job) => (
            <div key={job.id} className="job-card card">
              <div className="job-header">
                <div className="job-company-logo">
                  {job.company?.name?.charAt(0) || 'C'}
                </div>
                <div className="job-info">
                  <Link to={`/jobs/${job.id}`}>
                    <h3>{job.title}</h3>
                  </Link>
                  <p>{job.company?.name}</p>
                  <div className="job-meta">
                    <span><FiMapPin /> {job.location}</span>
                    <span><FiBriefcase /> {job.jobType}</span>
                    <span><FiClock /> {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="job-salary">
                {job.salary ? `$${job.salary}` : 'Salary not specified'}
              </div>
              <button className="btn btn-outline" onClick={() => handleApply(job.id)}>
                Easy Apply
              </button>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className="empty-state">
              <p>No jobs found. Try adjusting your search.</p>
            </div>
          )}
        </div>

        <div className="jobs-sidebar">
          <div className="card">
            <h3>Post a job</h3>
            <p>Reach millions of candidates</p>
            <button className="btn btn-outline" onClick={() => setShowCreateModal(true)}>
              Post a Job
            </button>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Post a Job</h2>
              <button onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateCompany}>
              <div className="modal-body">
                <h3>Company Info</h3>
                <div className="input-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea
                    value={companyForm.description}
                    onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>Industry</label>
                  <input
                    type="text"
                    value={companyForm.industry}
                    onChange={(e) => setCompanyForm({...companyForm, industry: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Continue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
