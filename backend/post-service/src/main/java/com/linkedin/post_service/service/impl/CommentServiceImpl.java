package com.linkedin.post_service.service.impl;

import com.linkedin.post_service.dto.comment.CreatePostCommentDto;
import com.linkedin.post_service.dto.comment.PostCommentDto;
import com.linkedin.post_service.entity.Post;
import com.linkedin.post_service.entity.PostComment;
import com.linkedin.post_service.entity.user.User;
import com.linkedin.post_service.repository.PostCommentsRepository;
import com.linkedin.post_service.repository.PostRepository;
import com.linkedin.post_service.service.CommentService;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final PostCommentsRepository postCommentsRepository;
    private final PostRepository postRepository;

    public CommentServiceImpl(PostCommentsRepository postCommentsRepository, PostRepository postRepository) {
        this.postCommentsRepository = postCommentsRepository;
        this.postRepository = postRepository;
    }

    @Override
    public PostCommentDto addPostComment(CreatePostCommentDto createPostCommentDto, long userId) {
        Post post = postRepository.findById(createPostCommentDto.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        PostComment comment = new PostComment();
        
        User user = new User();
        user.setId(userId);
        comment.setUser(user);
        
        comment.setPost(post);
        comment.setText(createPostCommentDto.getText());
        comment.setPostedAt(new Date());

        if (createPostCommentDto.getParentId() != null) {
            PostComment parentComment = postCommentsRepository.findById(createPostCommentDto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParent(parentComment);
        }

        PostComment savedComment = postCommentsRepository.save(comment);
        return mapToDto(savedComment);
    }

    @Override
    public PostCommentDto getCommentById(long id) {
        PostComment comment = postCommentsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        return mapToDto(comment);
    }

    @Override
    public List<PostCommentDto> getReplyComments(long parentCommentId) {
        return postCommentsRepository.findByParentId(parentCommentId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostCommentDto> getPostComments(long postId) {
        return postCommentsRepository.findByPostId(postId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public String deleteCommentById(long id, boolean isAdmin, long userId) {
        PostComment comment = postCommentsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (comment.getUser() != null && comment.getUser().getId() != userId && !isAdmin) {
            throw new RuntimeException("Not authorized to delete this comment");
        }

        postCommentsRepository.delete(comment);
        return "Comment deleted successfully";
    }

    private PostCommentDto mapToDto(PostComment comment) {
        PostCommentDto dto = new PostCommentDto();
        dto.setId(comment.getId());
        dto.setPostId(comment.getPost() != null ? comment.getPost().getId() : null);
        dto.setUserId(comment.getUser() != null ? comment.getUser().getId() : null);
        dto.setParentId(comment.getParent() != null ? comment.getParent().getId() : null);
        dto.setText(comment.getText());
        dto.setContent(comment.getText());
        dto.setPostedAt(comment.getPostedAt());
        dto.setCreatedAt(comment.getPostedAt());
        return dto;
    }
}
