package com.linkedin.chat_service.entity;

import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;
import java.util.Date;

@Data
@Entity
@Table
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ChatParticipant participant;

    @Column(name = "last_message_at")
    private Date lastMessageAt;
}
