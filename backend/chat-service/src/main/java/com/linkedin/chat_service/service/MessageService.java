package com.linkedin.chat_service.service;

import com.linkedin.chat_service.dto.MessageDto;

public interface MessageService {
    MessageDto sendMessage(Long chatId, Long senderId, String content);
    MessageDto updateMessage(Long id, String content, Long userId);
    String deleteMessage(Long id, Long userId);
}
