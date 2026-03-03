package com.linkedin.chat_service.repository;

import com.linkedin.chat_service.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    Optional<Chat> findByParticipantUserIdAndParticipantChatId(Long userId, Long participantId);
}
