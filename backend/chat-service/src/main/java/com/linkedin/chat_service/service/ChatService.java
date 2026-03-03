package com.linkedin.chat_service.service;

import com.linkedin.chat_service.dto.ChatDto;

import java.util.List;

public interface ChatService {
    ChatDto createChat(Long participantId, Long userId);
    List<ChatDto> getAllChats(Long userId);
    ChatDto getChatById(Long id, Long userId);
    String deleteChat(Long id, Long userId);
}
