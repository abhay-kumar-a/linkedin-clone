package com.linkedin.post_service.service;

import com.linkedin.post_service.dto.comment.CreatePostCommentDto;
import com.linkedin.post_service.dto.comment.PostCommentDto;

import java.util.List;

public interface CommentService {
    PostCommentDto addPostComment(CreatePostCommentDto createPostCommentDto, long userId);
    PostCommentDto getCommentById(long id);
    List<PostCommentDto> getReplyComments(long parentCommentId);
    List<PostCommentDto> getPostComments(long postId);
    String deleteCommentById(long id, boolean isAdmin, long userId);
}
