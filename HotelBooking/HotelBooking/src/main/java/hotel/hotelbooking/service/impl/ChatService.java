package hotel.hotelbooking.service.impl;

import hotel.hotelbooking.entity.ChatMessage;
import hotel.hotelbooking.repo.ChatRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class ChatService {
    private final ChatRepository chatRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChatService(ChatRepository chatRepository, SimpMessagingTemplate messagingTemplate) {
        this.chatRepository = chatRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public void processMessage(ChatMessage chatMessage) {
        chatMessage.setTimestamp(LocalDateTime.now());
        ChatMessage saved = chatRepository.save(chatMessage);

        // Gửi tin nhắn đến người nhận cụ thể
        messagingTemplate.convertAndSendToUser(
                String.valueOf(chatMessage.getRecipientId()),
                "/topic/messages",
                saved
        );
    }

    public List<ChatMessage> getChatHistory(Long senderId, Long recipientId) {
        return chatRepository.findBySenderIdAndRecipientId(senderId, recipientId);
    }
}
