package com.linkedin.post_service.service.impl;

import com.linkedin.post_service.dto.CreatePostDto;
import com.linkedin.post_service.dto.PostDto;
import com.linkedin.post_service.dto.comment.PostCommentDto;
import com.linkedin.post_service.entity.Post;
import com.linkedin.post_service.entity.PostFiles;
import com.linkedin.post_service.entity.user.User;
import com.linkedin.post_service.enums.PostFileType;
import com.linkedin.post_service.feign_clients.FileServiceClient;
import com.linkedin.post_service.repository.PostRepository;
import com.linkedin.post_service.service.PostService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final FileServiceClient fileServiceClient;

    public PostServiceImpl(PostRepository postRepository, FileServiceClient fileServiceClient) {
        this.postRepository = postRepository;
        this.fileServiceClient = fileServiceClient;
    }

    @Override
    public PostDto createPost(CreatePostDto createPostDto, long userId) {
        Post post = new Post();
        
        User user = new User();
        user.setId(userId);
        post.setPostedBy(user);
        
        post.setTitle(createPostDto.getTitle());
        post.setDescription(createPostDto.getDescription());
        post.setPostedAt(new Date());
        
        Post savedPost = postRepository.save(post);
        
        return mapToDto(savedPost);
    }

    @Override
    public String uploadPostFile(MultipartFile file, String fileType, long postId, long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        String fileUrl = fileServiceClient.uploadFile(file);
        
        PostFiles postFile = new PostFiles();
        postFile.setPost(post);
        postFile.setType(PostFileType.IMAGE);
        postFile.setLink(fileUrl);
        
        post.setPostFile(postFile);
        postRepository.save(post);
        
        return fileUrl;
    }

    @Override
    public List<PostDto> getAllPosts(long userId) {
        return postRepository.findAllByOrderByPostedAtDesc()
                .stream()
                .map(post -> mapToDto(post))
                .collect(Collectors.toList());
    }

    @Override
    public PostDto getPostById(long id, long userId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return mapToDto(post);
    }

    @Override
    public String deletePostById(long id, long userId, boolean isAdmin) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (post.getPostedBy().getId() != userId && !isAdmin) {
            throw new RuntimeException("Not authorized to delete this post");
        }
        
        postRepository.delete(post);
        return "Post deleted successfully";
    }

    private PostDto mapToDto(Post post) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setPostedBy(post.getPostedBy() != null ? post.getPostedBy().getId() : null);
        dto.setTitle(post.getTitle());
        dto.setDescription(post.getDescription());
        dto.setPostedAt(post.getPostedAt());
        dto.setNumComments(post.getComments() != null ? post.getComments().size() : 0);
        dto.setNumLikes(post.getLikes() != null ? post.getLikes().size() : 0);
        
        if (post.getComments() != null) {
            dto.setComments(post.getComments().stream()
                    .map(comment -> {
                        PostCommentDto commentDto = new PostCommentDto();
                        commentDto.setId(comment.getId());
                        commentDto.setContent(comment.getContent());
                        commentDto.setUserId(comment.getUser() != null ? comment.getUser().getId() : null);
                        commentDto.setCreatedAt(comment.getCreatedAt());
                        return commentDto;
                    })
                    .collect(Collectors.toList()));
        }
        
        if (post.getPostFile() != null) {
            dto.setLink(post.getPostFile().getLink());
        }
        
        return dto;
    }
}
