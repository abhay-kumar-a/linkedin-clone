package com.linkedin.post_service.service.impl;

import com.linkedin.post_service.entity.Post;
import com.linkedin.post_service.entity.PostLikes;
import com.linkedin.post_service.entity.user.User;
import com.linkedin.post_service.repository.PostLikesRepository;
import com.linkedin.post_service.repository.PostRepository;
import com.linkedin.post_service.service.PostLikeService;
import org.springframework.stereotype.Service;

@Service
public class PostLikeServiceImpl implements PostLikeService {

    private final PostLikesRepository postLikesRepository;
    private final PostRepository postRepository;

    public PostLikeServiceImpl(PostLikesRepository postLikesRepository, PostRepository postRepository) {
        this.postLikesRepository = postLikesRepository;
        this.postRepository = postRepository;
    }

    @Override
    public String likePost(long postId, long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (postLikesRepository.existsByPostIdAndUserId(postId, userId)) {
            postLikesRepository.deleteByPostIdAndUserId(postId, userId);
            return "Like removed";
        }

        PostLikes like = new PostLikes();
        
        User user = new User();
        user.setId(userId);
        like.setUser(user);
        
        like.setPost(post);

        postLikesRepository.save(like);
        return "Post liked";
    }
}
