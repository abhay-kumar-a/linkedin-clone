package com.linkedin.post_service.dto.comment;

import lombok.Data;

import java.util.Date;

@Data
public class PostCommentDto {
    private Long id;
    private Long postId;
    private Long userId;
    private Long parentId;
    private String content;
    private Date createdAt;
    private String text;
    private Long post;
    private Long user;
    private Long parent;
    private Date postedAt;
}
