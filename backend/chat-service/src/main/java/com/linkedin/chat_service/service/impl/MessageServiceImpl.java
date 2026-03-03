package com.linkedin.chat_service.service.impl;

import com.linkedin.chat_service.dto.MessageDto;
import com.linkedin.chat_service.entity.Chat;
import com.linkedin.chat_service.entity.Message;
import com.linkedin.chat_service.repository.ChatRepository;
import com.linkedin.chat_service.repository.MessageRepository;
import com.linkedin.chat_service.service.MessageService;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;

    public MessageServiceImpl(MessageRepository messageRepository, ChatRepository chatRepository) {
        this.messageRepository = messageRepository;
        this.chatRepository = chatRepository;
    }

    @Override
    public MessageDto sendMessage(Long chatId, Long senderId, String content) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        Message message = new Message();
        message.setChat(chat);
        message.setSenderId(senderId);
        message.setContent(content);
        message.setCreatedAt(new Date());

        Message saved = messageRepository.save(message);
        
        chat.setLastMessageAt(new Date());
        chatRepository.save(chat);

        return mapToDto(saved);
    }

    @Override
    public MessageDto updateMessage(Long id, String content, Long userId) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getSenderId().equals(userId)) {
            throw new RuntimeException("Not authorized to update this message");
        }

        message.setContent(content);
        Message saved = messageRepository.save(message);
        return mapToDto(saved);
    }

    @Override
    public String deleteMessage(Long id, Long userId) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getSenderId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this message");
        }

        message.setDeleted(true);
        messageRepository.save(message);
        return "Message deleted";
    }

    private MessageDto mapToDto(Message message) {
        MessageDto dto = new MessageDto();
        dto.setId(message.getId());
        dto.setChatId(message.getChat().getId());
        dto.setSenderId(message.getSenderId());
        dto.setContent(message.getContent());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }
}
