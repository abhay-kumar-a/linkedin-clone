package com.linkedIn.users_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.linkedIn.users_service.dto.UpdateUserDto;
import com.linkedIn.users_service.dto.UserDto;
import com.linkedIn.users_service.dto.UserFileDto;
import com.linkedIn.users_service.dto.UserProfileDto;
import com.linkedIn.users_service.dto.resume.UserResumeDto;
import com.linkedIn.users_service.service.UserService;
import com.linkedIn.users_service.utils.UserUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserUtils userUtils;

    public UserController(UserService userService, UserUtils userUtils) {
        this.userService = userService;
        this.userUtils = userUtils;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadUserFile(@RequestParam("file") MultipartFile file, @RequestParam("fileType") String fileType, HttpServletRequest request) {
        long userId = this.userUtils.getUserId(request);

        String response = this.userService.uploadUserFile(file, fileType, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/files")
    public ResponseEntity<List<UserFileDto>> getAllUserFiles(HttpServletRequest request) {
        long userId = this.userUtils.getUserId(request);

        List<UserFileDto> userFileDtos = this.userService.getAllFiles(userId);

        return ResponseEntity.ok(userFileDtos);
    }

    @GetMapping("/files/{type}")
    public ResponseEntity<UserFileDto> getFileByType(HttpServletRequest request, @PathVariable("type") String type) {
        long userId = this.userUtils.getUserId(request);

        UserFileDto userFileDto = this.userService.getFileByType(type, userId);

        return ResponseEntity.ok(userFileDto);
    }

    @GetMapping("/resumes")
    public ResponseEntity<List<UserResumeDto>> getUserResumes(HttpServletRequest request) {
        long userId = this.userUtils.getUserId(request);

        List<UserResumeDto> resumes = this.userService.getUserResumes(userId);

        return ResponseEntity.ok(resumes);
    }

    @GetMapping("")
    public ResponseEntity<List<UserDto>> getUsers(HttpServletRequest request) {
        userUtils.shouldBeAdmin(request);

        List<UserDto> users = userService.getUsers();

        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("id") long userId) {
        UserDto user = this.userService.getUserById(userId);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable(name = "id") long id,
                                             HttpServletRequest request) {
        userUtils.shouldBeAdmin(request);

        String message = userService.deleteUser(id);

        return ResponseEntity.ok(message);
    }

    @PutMapping("")
    public ResponseEntity<UserDto> updateUser(@Valid @RequestBody UpdateUserDto updateUserDto, HttpServletRequest request) {
        String email = userUtils.getUserEmail(request);

        UserDto userDto = this.userService.updateUser(updateUserDto, email);

        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getUserProfile(HttpServletRequest request) {
        String email = userUtils.getUserEmail(request);

        UserProfileDto userProfileDto = this.userService.getProfile(email);

        return ResponseEntity.ok(userProfileDto);
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<UserProfileDto> getUserProfileById(@PathVariable("id") long id) {
        UserProfileDto userProfileDto = this.userService.getProfileById(id);

        return ResponseEntity.ok(userProfileDto);
    }

    @GetMapping("/friends")
    public ResponseEntity<List<UserDto>> getUserFriends(HttpServletRequest request) {
        String email = userUtils.getUserEmail(request);

        List<UserDto> friends = this.userService.getUserFriends(email);

        return ResponseEntity.ok(friends);
    }
}
