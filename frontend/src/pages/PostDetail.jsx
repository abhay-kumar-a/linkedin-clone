import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { FiHeart, FiMessageCircle, FiShare2, FiSend, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const [postRes, commentsRes] = await Promise.all([
        postAPI.getPostById(id),
        postAPI.getPostComments(id)
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await postAPI.likePost({ postId: id });
      setPost({ ...post, liked: !post.liked });
    } catch (error) {
      toast.error('Error liking post');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await postAPI.addComment({ content: newComment, postId: id });
      setComments([...comments, response.data]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Error adding comment');
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="container post-detail-page">
        <Link to="/" className="back-link">
          <FiArrowLeft /> Back to Feed
        </Link>

        <div className="post-detail card">
          <div className="post-header">
            <Link to={`/profile/${post.userId}`} className="post-author">
              <div className="post-avatar">
                {post.user?.firstName?.charAt(0)}{post.user?.lastName?.charAt(0)}
              </div>
              <div className="post-info">
                <h4>{post.user?.firstName} {post.user?.lastName}</h4>
                <p>{post.user?.headline}</p>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </Link>
          </div>

          <div className="post-content">
            <p>{post.content}</p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="Post" className="post-image" />
            )}
          </div>

          <div className="post-stats">
            <span>{post.likes?.length || 0} likes</span>
            <span>{comments.length} comments</span>
          </div>

          <div className="post-actions">
            <button onClick={handleLike}>
              <FiHeart /> Like
            </button>
            <button>
              <FiMessageCircle /> Comment
            </button>
            <button>
              <FiShare2 /> Share
            </button>
          </div>

          <div className="post-comments-section">
            <h3>Comments</h3>
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
                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
