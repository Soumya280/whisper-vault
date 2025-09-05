package com.forum.whispervault.dto;

public record AllMessages(
        Integer messageId,
        Integer userId,
        String username,
        String title,
        String content,
        String createdAt,
        Boolean edited) {
}
