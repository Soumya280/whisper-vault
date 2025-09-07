package com.forum.whispervault.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.forum.whispervault.dto.AllMessages;
import com.forum.whispervault.dto.CreateMessage;
import com.forum.whispervault.dto.EditMessage;
import com.forum.whispervault.entity.Message;
import com.forum.whispervault.entity.User;
import com.forum.whispervault.repository.MessageRepository;
import com.forum.whispervault.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/message")
@CrossOrigin(origins = "https://soumya280.github.io")
public class MessageController {

    @Autowired
    private MessageRepository repository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createMessage(HttpServletRequest request, @RequestBody CreateMessage createMessage) {

        HttpSession session = request.getSession(false);
        User user = null;

        if (session != null) {
            user = userRepository.findById((Integer) session.getAttribute("userId")).orElse(null);
        }

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("createMessage", "unauthorized"));
        }

        if (createMessage.getContent() == null || createMessage.getContent().equals("")) {

            return ResponseEntity.badRequest().body(Map.of("createMessage", "content is empty!!!"));
        }

        Message message = new Message();

        message.setUser(user);
        message.setTitle(createMessage.getTitle());
        message.setContent(createMessage.getContent());

        repository.save(message);

        return ResponseEntity.ok(Map.of("createMessage", createMessage));
    }

    @PostMapping("/edit")
    public ResponseEntity<?> edit(HttpServletRequest request, @RequestBody EditMessage editMessage) {
        try {
            HttpSession session = request.getSession(false);
            if (session == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("editMessage", "please login first"));
            }

            Integer messageId = editMessage.getMessageId();
            Integer userId = (Integer) session.getAttribute("userId");

            if (messageId == null || userId == null) {
                return ResponseEntity.badRequest().body(Map.of("editMessage", "invalid request"));
            }

            User user = userRepository.findById(userId).orElse(null);
            Message message = repository.findById(messageId).orElse(null);

            if (user == null || message == null || !message.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("editMessage", "message not found or not owned by you"));
            }

            if (editMessage.getContent() == null || editMessage.getContent().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("editMessage", "content is empty!!!"));
            }

            message.setTitle(editMessage.getTitle());
            message.setContent(editMessage.getContent());
            message.setEdited(true);
            repository.save(message);

            return ResponseEntity.ok(Map.of("editMessage", "updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("editMessage", "something went wrong: " + e.getMessage()));
        }
    }

    @GetMapping("/all_messages")
    public ResponseEntity<List<AllMessages>> allMessages() {
        List<AllMessages> messages = repository
                .findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(msg -> new AllMessages(
                        msg.getMessageId(),
                        msg.getUser().getId(),
                        msg.getUser().getUsername(),
                        msg.getTitle(),
                        msg.getContent(),
                        msg.getCreatedAt().toString(),
                        msg.getEdited()))
                .toList();

        if (messages.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(messages);
    }
}