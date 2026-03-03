import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { FiMapPin, FiBriefcase, FiClock, FiDollarSign, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await jobAPI.getJobDetailed(id);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await jobAPI.applyJob({ jobId: id });
      toast.success('Applied successfully!');
    } catch (error) {
      toast.error('You have already applied or an error occurred');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="container job-detail-page">
        <Link to="/jobs" className="back-link">
          <FiArrowLeft /> Back to Jobs
        </Link>

        <div className="job-detail">
          <div className="job-main card">
            <div className="job-header">
              <div className="job-logo">
                {job?.company?.name?.charAt(0) || 'C'}
              </div>
              <div className="job-info">
                <h1>{job?.title}</h1>
                <Link to={`/companies/${job?.company?.id}`} className="company-link">
                  {job?.company?.name}
                </Link>
                <div className="job-meta">
                  <span><FiMapPin /> {job?.location}</span>
                  <span><FiBriefcase /> {job?.jobType}</span>
                  <span><FiClock /> Posted {new Date(job?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="job-salary">
              <FiDollarSign />
              <span>{job?.salary ? `$${job.salary}` : 'Salary not specified'}</span>
            </div>

            <div className="job-section">
              <h3>Description</h3>
              <p>{job?.description || 'No description provided'}</p>
            </div>

            <div className="job-section">
              <h3>Requirements</h3>
              <p>{job?.requirements || 'No specific requirements'}</p>
            </div>

            <button 
              className="btn btn-primary apply-btn" 
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? 'Applying...' : 'Easy Apply'}
            </button>
          </div>

          <div className="job-sidebar">
            <div className="card">
              <h3>Job Details</h3>
              <div className="detail-item">
                <FiBriefcase />
                <div>
                  <label>Job Type</label>
                  <span>{job?.jobType}</span>
                </div>
              </div>
              <div className="detail-item">
                <FiDollarSign />
                <div>
                  <label>Salary</label>
                  <span>{job?.salary ? `$${job.salary}` : 'Not specified'}</span>
                </div>
              </div>
              <div className="detail-item">
                <FiMapPin />
                <div>
                  <label>Location</label>
                  <span>{job?.location}</span>
                </div>
              </div>
            </div>

            {job?.company && (
              <div className="card company-card">
                <h3>About Company</h3>
                <Link to={`/companies/${job.company.id}`}>
                  <div className="company-logo">
                    {job.company.name?.charAt(0)}
                  </div>
                  <h4>{job.company.name}</h4>
                </Link>
                <p>{job.company.industry}</p>
                <span>{job.company.size} employees</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
