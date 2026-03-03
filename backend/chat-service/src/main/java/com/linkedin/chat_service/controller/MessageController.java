package com.linkedin.chat_service.controller;

import com.linkedin.chat_service.dto.MessageDto;
import com.linkedin.chat_service.service.MessageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chats/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<MessageDto> sendMessage(@RequestBody Map<String, Object> request) {
        Long chatId = Long.valueOf(request.get("chatId").toString());
        String content = request.get("content").toString();
        Long userId = getUserId(null);
        
        MessageDto message = messageService.sendMessage(chatId, userId, content);
        return new ResponseEntity<>(message, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageDto> updateMessage(@PathVariable Long id, @RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        Long userId = getUserId(httpRequest);
        String content = request.get("content");
        MessageDto message = messageService.updateMessage(id, content, userId);
        return ResponseEntity.ok(message);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMessage(@PathVariable Long id, HttpServletRequest request) {
        Long userId = getUserId(request);
        String response = messageService.deleteMessage(id, userId);
        return ResponseEntity.ok(response);
    }

    private Long getUserId(HttpServletRequest request) {
        return 1L;
    }
}
