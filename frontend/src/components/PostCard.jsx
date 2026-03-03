import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';
import { FiMoreHorizontal, FiHeart, FiMessageCircle, FiShare2, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './PostCard.css';

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = async () => {
    try {
      await postAPI.likePost({ postId: post.id });
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      toast.error('Error liking post');
    }
  };

  const handleShowComments = async () => {
    if (!showComments) {
      try {
        const response = await postAPI.getPostComments(post.id);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await postAPI.addComment({
        content: newComment,
        postId: post.id
      });
      setComments([...comments, response.data]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Error adding comment');
    }
  };

  const handleDelete = async () => {
    try {
      await postAPI.deletePost(post.id);
      toast.success('Post deleted');
      onUpdate();
    } catch (error) {
      toast.error('Error deleting post');
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="post-card card">
      <div className="post-header">
        <Link to={`/profile/${post.userId}`} className="post-author">
          <div className="post-avatar">
            {post.user?.firstName?.charAt(0)}{post.user?.lastName?.charAt(0)}
          </div>
          <div className="post-info">
            <h4>{post.user?.firstName} {post.user?.lastName}</h4>
            <p>{post.user?.headline || 'LinkedIn User'}</p>
            <span>{timeAgo(post.createdAt)}</span>
          </div>
        </Link>
        <div className="post-menu">
          <button onClick={() => setShowMenu(!showMenu)}>
            <FiMoreHorizontal />
          </button>
          {showMenu && (
            <div className="menu-dropdown">
              {post.userId === user?.id && (
                <button onClick={handleDelete}>Delete Post</button>
              )}
              <button>Save Post</button>
              <button>Copy Link</button>
            </div>
          )}
        </div>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="Post" className="post-image" />
        )}
      </div>

      <div className="post-stats">
        <span>{likeCount} likes</span>
        <span>{comments.length} comments</span>
      </div>

      <div className="post-actions">
        <button className={liked ? 'active' : ''} onClick={handleLike}>
          <FiHeart /> Like
        </button>
        <button onClick={handleShowComments}>
          <FiMessageCircle /> Comment
        </button>
        <button>
          <FiShare2 /> Share
        </button>
        <button>
          <FiSend /> Send
        </button>
      </div>

      {showComments && (
        <div className="post-comments">
          <form onSubmit={handleAddComment} className="comment-form">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Post</button>
          </form>
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-avatar">
                  {comment.user?.firstName?.charAt(0)}
                </div>
                <div className="comment-content">
                  <h5>{comment.user?.firstName} {comment.user?.lastName}</h5>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
