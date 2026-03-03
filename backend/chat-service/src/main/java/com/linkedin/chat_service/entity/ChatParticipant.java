package com.linkedin.chat_service.entity;

import lombok.Data;

import jakarta.persistence.*;

@Data
@Entity
@Table
public class ChatParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "chat_id")
    private Long chatId;
}
