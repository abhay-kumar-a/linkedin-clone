package com.linkedin.chat_service.dto;

import lombok.Data;

import java.util.Date;

@Data
public class MessageDto {
    private Long id;
    private Long chatId;
    private Long senderId;
    private String content;
    private Date createdAt;
}
