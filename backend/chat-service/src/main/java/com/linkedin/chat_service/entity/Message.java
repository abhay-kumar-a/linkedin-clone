package com.linkedin.chat_service.entity;

import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;
import java.util.Date;

@Data
@Entity
@Table
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Chat chat;

    @Column(name = "sender_id")
    private Long senderId;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at")
    private Date createdAt;

    private boolean isDeleted;
}
