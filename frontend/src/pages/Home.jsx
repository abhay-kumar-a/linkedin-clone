import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, postAPI } from '../services/api';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import Loading from '../components/Loading';
import { FiBriefcase, FiUsers } from 'react-icons/fi';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getAllPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setShowCreatePost(false);
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="container main-content">
        <aside className="sidebar">
          <div className="profile-card card">
            <div className="profile-cover"></div>
            <div className="profile-info">
              <div className="profile-avatar">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <h3>{user?.firstName} {user?.lastName}</h3>
              <p>{user?.headline || 'Add a headline'}</p>
            </div>
            <div className="profile-stats">
              <div className="stat">
                <span>Connections</span>
                <strong>150</strong>
              </div>
              <div className="stat">
                <span>Profile views</span>
                <strong>32</strong>
              </div>
            </div>
          </div>

          <div className="sidebar-card card">
            <h4>Recent</h4>
            <div className="sidebar-item">
              <FiBriefcase />
              <span>Software Engineering</span>
            </div>
            <div className="sidebar-item">
              <FiUsers />
              <span>React Developers</span>
            </div>
          </div>
        </aside>

        <main className="feed">
          <div className="create-post-card card">
            <div className="create-post-input" onClick={() => setShowCreatePost(true)}>
              <div className="avatar">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</div>
              <span>Start a post</span>
            </div>
            <div className="create-post-actions">
              <button className="action-btn">
                <FiBriefcase /> Photo
              </button>
              <button className="action-btn">
                <FiBriefcase /> Video
              </button>
              <button className="action-btn">
                <FiBriefcase /> Event
              </button>
            </div>
          </div>

          {showCreatePost && (
            <CreatePost 
              onClose={() => setShowCreatePost(false)}
              onPostCreated={handlePostCreated}
            />
          )}

          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
          ))}
        </main>

        <aside className="right-sidebar">
          <div className="sidebar-card card">
            <h4>Add to your feed</h4>
            <div className="feed-suggestion">
              <div className="suggestion-avatar">JD</div>
              <div className="suggestion-info">
                <h5>John Doe</h5>
                <p>Software Engineer at Google</p>
                <button className="btn btn-outline">+ Follow</button>
              </div>
            </div>
            <div className="feed-suggestion">
              <div className="suggestion-avatar">JS</div>
              <div className="suggestion-info">
                <h5>Jane Smith</h5>
                <p>Product Manager at Amazon</p>
                <button className="btn btn-outline">+ Follow</button>
              </div>
            </div>
          </div>

          <div className="sidebar-card card">
            <h4>Today's most viewed courses</h4>
            <div className="course-item">
              <span>1. React - The Complete Guide</span>
              <span>1,234 views</span>
            </div>
            <div className="course-item">
              <span>2. Java Spring Boot</span>
              <span>987 views</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
