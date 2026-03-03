package com.linkedin.chat_service.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ChatDto {
    private Long id;
    private Long participantId;
    private MessageDto lastMessage;
    private Date lastMessageAt;
    private List<MessageDto> messages;
}
