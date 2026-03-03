import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';
import { FiX, FiImage, FiVideo, FiCalendar, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './CreatePost.css';

export default function CreatePost({ onClose, onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    setLoading(true);
    try {
      let imageUrl = null;
      
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadResponse = await postAPI.uploadPostFile(formData);
        imageUrl = uploadResponse.data;
      }

      const response = await postAPI.createPost({
        content,
        imageUrl
      });

      toast.success('Post created successfully!');
      onPostCreated(response.data);
    } catch (error) {
      toast.error('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-modal">
      <div className="create-post-content card">
        <div className="create-post-header">
          <h3>Create a post</h3>
          <button onClick={onClose} className="close-btn">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="create-post-user">
            <div className="avatar">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="user-info">
              <h4>{user?.firstName} {user?.lastName}</h4>
              <select>
                <option>Anyone</option>
                <option>Connections only</option>
                <option>Private</option>
              </select>
            </div>
          </div>

          <textarea
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />

          {preview && (
            <div className="file-preview">
              <img src={preview} alt="Preview" />
              <button type="button" onClick={() => { setFile(null); setPreview(null); }}>
                <FiX />
              </button>
            </div>
          )}

          <div className="create-post-footer">
            <div className="attach-buttons">
              <label className="attach-btn">
                <FiImage />
                <input type="file" accept="image/*" onChange={handleFileChange} hidden />
              </label>
              <button type="button" className="attach-btn">
                <FiVideo />
              </button>
              <button type="button" className="attach-btn">
                <FiCalendar />
              </button>
              <button type="button" className="attach-btn">
                <FiMapPin />
              </button>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading || (!content.trim() && !file)}>
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
