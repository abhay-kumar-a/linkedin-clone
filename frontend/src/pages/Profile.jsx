import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { FiEdit2, FiPlus, FiMapPin, FiBriefcase, FiCalendar, FiLink, FiMail, FiPhone } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Profile.css';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    headline: '',
    bio: '',
    location: '',
    email: '',
    phone: ''
  });
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [expForm, setExpForm] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const isOwnProfile = !id || id === currentUser?.id;

  useEffect(() => {
    fetchProfile();
    if (isOwnProfile) {
      fetchExperiences();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = id 
        ? await userAPI.getUserProfile(id)
        : await userAPI.getCurrentUser();
      setProfile(response.data);
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        headline: response.data.headline || '',
        bio: response.data.bio || '',
        location: response.data.location || '',
        email: response.data.email || '',
        phone: response.data.phone || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      const response = await userAPI.getExperiences();
      setExperiences(response.data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await userAPI.updateUser(formData);
      setProfile(response.data);
      updateUser(response.data);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      await userAPI.addExperience(expForm);
      toast.success('Experience added!');
      setShowExperienceModal(false);
      setExpForm({ title: '', company: '', location: '', startDate: '', endDate: '', description: '' });
      fetchExperiences();
    } catch (error) {
      toast.error('Error adding experience');
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      await userAPI.deleteExperience(id);
      toast.success('Experience deleted');
      fetchExperiences();
    } catch (error) {
      toast.error('Error deleting experience');
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      await userAPI.uploadFile(formData);
      toast.success(`${type} uploaded!`);
      fetchProfile();
    } catch (error) {
      toast.error('Error uploading file');
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="container profile-page">
        <div className="profile-header card">
          <div className="profile-cover-photo">
            {isOwnProfile && (
              <label className="cover-upload">
                <FiEdit2 />
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} hidden />
              </label>
            )}
          </div>
          <div className="profile-header-content">
            <div className="profile-photo">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
                </div>
              )}
              {isOwnProfile && (
                <label className="avatar-upload">
                  <FiEdit2 />
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} hidden />
                </label>
              )}
            </div>
            <div className="profile-header-info">
              <h1>{profile?.firstName} {profile?.lastName}</h1>
              <p className="headline">{profile?.headline || 'Add a headline'}</p>
              <p className="location">
                {profile?.location || 'Add location'} • 
                <a href="#"> Contact info</a>
              </p>
              <p className="connections">{profile?.connections?.length || 0} connections</p>
              {isOwnProfile ? (
                <button className="btn btn-primary" onClick={() => setEditing(true)}>
                  Edit profile
                </button>
              ) : (
                <button className="btn btn-primary">Connect</button>
              )}
            </div>
          </div>
        </div>

        <div className="profile-body">
          <div className="profile-main">
            <div className="card section">
              <div className="section-header">
                <h2>About</h2>
              </div>
              <p>{profile?.bio || 'No bio yet'}</p>
            </div>

            <div className="card section">
              <div className="section-header">
                <h2>Experience</h2>
                {isOwnProfile && (
                  <button className="btn btn-outline" onClick={() => setShowExperienceModal(true)}>
                    <FiPlus /> Add
                  </button>
                )}
              </div>
              {experiences.length > 0 ? (
                experiences.map((exp) => (
                  <div key={exp.id} className="experience-item">
                    <div className="exp-icon">
                      <FiBriefcase />
                    </div>
                    <div className="exp-content">
                      <h4>{exp.title}</h4>
                      <p>{exp.company}</p>
                      <p className="exp-date">
                        <FiCalendar /> {exp.startDate} - {exp.endDate || 'Present'}
                      </p>
                      {exp.location && (
                        <p className="exp-location">
                          <FiMapPin /> {exp.location}
                        </p>
                      )}
                      <p className="exp-description">{exp.description}</p>
                    </div>
                    {isOwnProfile && (
                      <button className="delete-btn" onClick={() => handleDeleteExperience(exp.id)}>
                        Delete
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="empty-state">No experience added yet</p>
              )}
            </div>
          </div>

          <div className="profile-sidebar">
            <div className="card section">
              <h2>Info</h2>
              <div className="info-item">
                <FiMapPin /> {profile?.location || 'Add location'}
              </div>
              <div className="info-item">
                <FiBriefcase /> {profile?.headline || 'Add headline'}
              </div>
              <div className="info-item">
                <FiLink /> {profile?.website || 'Add website'}
              </div>
            </div>
          </div>
        </div>

        {editing && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Edit Profile</h2>
                <button onClick={() => setEditing(false)}>×</button>
              </div>
              <form onSubmit={handleUpdateProfile}>
                <div className="modal-body">
                  <div className="form-row">
                    <div className="input-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="input-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Headline</label>
                    <input
                      type="text"
                      value={formData.headline}
                      onChange={(e) => setFormData({...formData, headline: e.target.value})}
                    />
                  </div>
                  <div className="input-group">
                    <label>Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={4}
                    />
                  </div>
                  <div className="input-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showExperienceModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Add Experience</h2>
                <button onClick={() => setShowExperienceModal(false)}>×</button>
              </div>
              <form onSubmit={handleAddExperience}>
                <div className="modal-body">
                  <div className="input-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={expForm.title}
                      onChange={(e) => setExpForm({...expForm, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Company</label>
                    <input
                      type="text"
                      value={expForm.company}
                      onChange={(e) => setExpForm({...expForm, company: e.target.value})}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={expForm.location}
                      onChange={(e) => setExpForm({...expForm, location: e.target.value})}
                    />
                  </div>
                  <div className="form-row">
                    <div className="input-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={expForm.startDate}
                        onChange={(e) => setExpForm({...expForm, startDate: e.target.value})}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={expForm.endDate}
                        onChange={(e) => setExpForm({...expForm, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Description</label>
                    <textarea
                      value={expForm.description}
                      onChange={(e) => setExpForm({...expForm, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowExperienceModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
