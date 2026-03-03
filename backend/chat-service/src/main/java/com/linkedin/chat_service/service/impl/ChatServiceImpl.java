package com.linkedin.chat_service.service.impl;

import com.linkedin.chat_service.dto.ChatDto;
import com.linkedin.chat_service.dto.MessageDto;
import com.linkedin.chat_service.entity.Chat;
import com.linkedin.chat_service.entity.ChatParticipant;
import com.linkedin.chat_service.entity.Message;
import com.linkedin.chat_service.repository.ChatRepository;
import com.linkedin.chat_service.repository.MessageRepository;
import com.linkedin.chat_service.service.ChatService;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;

    public ChatServiceImpl(ChatRepository chatRepository, MessageRepository messageRepository) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
    }

    @Override
    public ChatDto createChat(Long participantId, Long userId) {
        Chat chat = new Chat();
        
        ChatParticipant participant = new ChatParticipant();
        participant.setUserId(participantId);
        participant.setChatId(userId);
        
        chat.setParticipant(participant);
        chat.setLastMessageAt(new Date());

        Chat saved = chatRepository.save(chat);
        return mapToDto(saved);
    }

    @Override
    public List<ChatDto> getAllChats(Long userId) {
        return chatRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ChatDto getChatById(Long id, Long userId) {
        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat not found"));
        
        ChatDto dto = mapToDto(chat);
        
        List<MessageDto> messages = messageRepository.findByChatIdOrderByCreatedAtAsc(id)
                .stream()
                .map(this::mapMessageToDto)
                .collect(Collectors.toList());
        dto.setMessages(messages);
        
        return dto;
    }

    @Override
    public String deleteChat(Long id, Long userId) {
        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat not found"));
        chatRepository.delete(chat);
        return "Chat deleted successfully";
    }

    private ChatDto mapToDto(Chat chat) {
        ChatDto dto = new ChatDto();
        dto.setId(chat.getId());
        dto.setLastMessageAt(chat.getLastMessageAt());
        if (chat.getParticipant() != null) {
            dto.setParticipantId(chat.getParticipant().getUserId());
        }
        return dto;
    }

    private MessageDto mapMessageToDto(Message message) {
        MessageDto dto = new MessageDto();
        dto.setId(message.getId());
        dto.setChatId(message.getChat().getId());
        dto.setSenderId(message.getSenderId());
        dto.setContent(message.getContent());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }
}
