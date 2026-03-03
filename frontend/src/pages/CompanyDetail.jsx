import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { companyAPI, jobAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { FiMapPin, FiGlobe, FiUsers, FiBriefcase, FiArrowLeft } from 'react-icons/fi';

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [companyRes, jobsRes] = await Promise.all([
        companyAPI.getCompanyDetailed(id),
        jobAPI.getJobsByCompany(id)
      ]);
      setCompany(companyRes.data);
      setJobs(jobsRes.data);
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="container company-detail-page">
        <Link to="/companies" className="back-link">
          <FiArrowLeft /> Back to Companies
        </Link>

        <div className="company-header card">
          <div className="company-cover"></div>
          <div className="company-header-content">
            <div className="company-logo">
              {company?.name?.charAt(0)}
            </div>
            <div className="company-info">
              <h1>{company?.name}</h1>
              <p>{company?.industry}</p>
              <div className="company-meta">
                <span><FiMapPin /> {company?.location || 'Location not specified'}</span>
                <span><FiUsers /> {company?.size || '1-10'} employees</span>
                <span><FiBriefcase /> {jobs.length} open jobs</span>
              </div>
              {company?.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="company-website">
                  <FiGlobe /> {company.website}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="company-body">
          <div className="company-about card">
            <h2>About</h2>
            <p>{company?.description || 'No description available'}</p>
          </div>

          <div className="company-jobs card">
            <h2>Open Jobs ({jobs.length})</h2>
            {jobs.length > 0 ? (
              <div className="jobs-list">
                {jobs.map((job) => (
                  <Link to={`/jobs/${job.id}`} key={job.id} className="job-item">
                    <h4>{job.title}</h4>
                    <p><FiMapPin /> {job.location}</p>
                    <span>{job.jobType}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="empty-state">No open positions</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
