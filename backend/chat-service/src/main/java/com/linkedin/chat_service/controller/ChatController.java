package com.linkedin.chat_service.controller;

import com.linkedin.chat_service.dto.ChatDto;
import com.linkedin.chat_service.service.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ChatDto> createChat(@RequestBody Map<String, Long> request) {
        Long participantId = request.get("participantId");
        Long userId = request.get("userId");
        ChatDto chat = chatService.createChat(participantId, userId);
        return new ResponseEntity<>(chat, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ChatDto>> getAllChats(HttpServletRequest request) {
        Long userId = getUserId(request);
        List<ChatDto> chats = chatService.getAllChats(userId);
        return ResponseEntity.ok(chats);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatDto> getChatById(@PathVariable Long id, HttpServletRequest request) {
        Long userId = getUserId(request);
        ChatDto chat = chatService.getChatById(id, userId);
        return ResponseEntity.ok(chat);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteChat(@PathVariable Long id, HttpServletRequest request) {
        Long userId = getUserId(request);
        String response = chatService.deleteChat(id, userId);
        return ResponseEntity.ok(response);
    }

    private Long getUserId(HttpServletRequest request) {
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader != null) {
            return Long.parseLong(userIdHeader);
        }
        return 1L;
    }
}
